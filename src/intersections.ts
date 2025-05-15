import { tableFromIPC, Table } from 'apache-arrow';
import { writable, get } from 'svelte/store';
import initWasm, { readParquet } from 'parquet-wasm';

// Path to the wasm file, assuming it's copied to your public/assets directory during build
// You might need to adjust this based on your bundler (Vite, Webpack, etc.)
// and how it handles static assets and Wasm.
// For Vite, placing it in 'public' and referring to it directly often works.
const PARQUET_WASM_URL = '/public/parquet_wasm_bg.wasm'; // Adjust if necessary

const INTERSECTIONS_URL = 'https://vector-tile-test-app.s3.us-east-1.amazonaws.com/all_intersections.parquet';

export type IntersectionRow = {
  id_left: string;
  namecol_left: string;
  namealt_left?: string | null; // Adjusted to allow null based on Parquet introspection
  id_right: string;
  namecol_right: string;
  namealt_right?: string | null; // Adjusted to allow null
  intersection_pct: number;
};

// Store for the raw intersection data
const intersectionDataStore = writable<IntersectionRow[] | null>(null);
const isLoadingStore = writable<boolean>(false);
const errorStore = writable<string | null>(null);

// Module-scoped cache to avoid re-processing if store is reset but data was fetched.
let S3_INTERSECTION_TABLE: IntersectionRow[] = []; 
let dataLoadedSuccessfully = false;
let wasmInitialized = false;

async function initializeWasm() {
  if (!wasmInitialized) {
    try {
      // Vite specific: Vite often handles Wasm imports and URLs automatically if setup.
      // If not, you might need to ensure PARQUET_WASM_URL is correctly resolved.
      // For instance, by ensuring parquet_wasm_bg.wasm is in your public directory
      // and the path is relative to the public directory.
      // Some bundlers might require a different approach, like file-loader for Webpack.
      await initWasm(PARQUET_WASM_URL); // Or just await initWasm(); if your bundler handles the path
      wasmInitialized = true;
      console.log('parquet-wasm initialized successfully.');
    } catch (err) {
      console.error('Error initializing parquet-wasm:', err);
      errorStore.set('Failed to initialize Parquet WASM module. ' + (err instanceof Error ? err.message : String(err)));
      throw err; // Re-throw to stop execution if Wasm init fails
    }
  }
}

// Function to fetch and load the Parquet data
export async function loadIntersectionData() {
  // Check if data is already loaded or a previous load attempt was made (successful or not)
  // Modify this logic if you need re-fetching on error or specific conditions.
  if (get(intersectionDataStore) || dataLoadedSuccessfully) {
    console.log('Intersection data already loaded or load attempt was made.');
    return;
  }

  isLoadingStore.set(true);
  errorStore.set(null);
  console.log('Fetching intersection data from:', INTERSECTIONS_URL);

  try {
    await initializeWasm(); // Ensure Wasm is initialized

    const response = await fetch(INTERSECTIONS_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} while fetching ${INTERSECTIONS_URL}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    console.log(`Fetched ${arrayBuffer.byteLength} bytes for intersections.`);
    
    // Use parquet-wasm to read the Parquet buffer
    const parquetUint8Array = new Uint8Array(arrayBuffer);
    const arrowWasmTable = readParquet(parquetUint8Array); // This is a Table in Wasm memory

    // Convert the Wasm table to an IPC stream buffer, then parse with Arrow JS
    const ipcStreamBuffer = arrowWasmTable.intoIPCStream(); // Produces Uint8Array
    const table = tableFromIPC(ipcStreamBuffer); // tableFromIPC from apache-arrow JS

    // Convert to a more JS-friendly array of objects
    // Note: toArray() can be memory intensive for very large tables.
    // Consider processing in chunks or using table.batches if performance is an issue.
    S3_INTERSECTION_TABLE = table.toArray().map(row => row?.toJSON() as IntersectionRow);
    intersectionDataStore.set(S3_INTERSECTION_TABLE);
    dataLoadedSuccessfully = true;
    console.log('Successfully loaded and processed intersection data using parquet-wasm.');

  } catch (error) {
    console.error('Error loading intersection data:', error);
    errorStore.set(error instanceof Error ? error.message : String(error));
    dataLoadedSuccessfully = false; // Mark as false so a retry might be possible
  } finally {
    isLoadingStore.set(false);
  }
}

// Derived store for easy access to the intersection data
export const intersections = {
  subscribe: intersectionDataStore.subscribe,
  getIsLoading: () => get(isLoadingStore),
  getError: () => get(errorStore),
  isLoaded: () => dataLoadedSuccessfully,
  getData: () => S3_INTERSECTION_TABLE // Direct access to the processed array
};

// Optional: Function to find intersections for a given left ID
export function findIntersectionsForLeftId(leftId: string): IntersectionRow[] {
  if (!dataLoadedSuccessfully) return [];
  return S3_INTERSECTION_TABLE.filter(row => row.id_left === leftId);
}

// Query function for district_details equivalent
export function getIntersectionsForDistrict(boundaryId: string, featureNameCol: string): IntersectionRow[] {
  if (!dataLoadedSuccessfully) {
    console.warn("Intersection data not loaded yet. Call loadIntersectionData() first.");
    // Optionally, trigger loadIntersectionData here if not already loading
    // if (!get(isLoadingStore)) { loadIntersectionData(); }
    return [];
  }
  return S3_INTERSECTION_TABLE.filter(row =>
    (row.id_left === boundaryId && row.namecol_left === featureNameCol) ||
    (row.id_right === boundaryId && row.namecol_right === featureNameCol)
  );
}

// Example: Trigger load when the module is first imported (optional, can be done from App.svelte)
// loadIntersectionData(); 