import geopandas
import pandas as pd
import requests
import io
import logging
import os
from typing import Union
import zipfile
import tempfile
from dotenv import load_dotenv

# --- Logging Setup ---
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# --- Load environment variables from .env --- 
load_dotenv()

SOCRATA_API_KEY = os.getenv('SOCRATA_API_KEY')
SOCRATA_API_SECRET = os.getenv('SOCRATA_API_SECRET')

# --- Dataset Definitions (Add ALL datasets here eventually) ---
datasets = [
  {
    "id": "cd",
    "datasetName": "Community Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/community-districts/nycd_25a.zip",
    "nameCol": "BoroCD",
    "nameAlt": None
  },
  {
    "id": "pp",
    "datasetName": "Police Precincts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/police-precincts/nypp_25a.zip",
    "nameCol": "Precinct",
    "nameAlt": None
  },
  {
    "id": "dsny",
    "datasetName": "Sanitation Districts",
    "url": "https://data.cityofnewyork.us/api/geospatial/i6mn-amj2?method=export&format=Shapefile",
    "nameCol": "district",
    "nameAlt": "districtco"
  },
  {
    "id": "fb",
    "datasetName": "Fire Battalions",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/fire-battalions/nyfb_25a.zip",
    "nameCol": "FireBN",
    "nameAlt": None
  },
  {
    "id": "sd",
    "datasetName": "School Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/school/nysd_25a.zip",
    "nameCol": "SchoolDist",
    "nameAlt": None
  },
  {
    "id": "hc",
    "datasetName": "Health Center Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/health-center/nyhc_25a.zip",
    "nameCol": "HCentDist",
    "nameAlt": None
  },
  {
    "id": "cc",
    "datasetName": "City Council Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/city-council/nycc_25a.zip",
    "nameCol": "CounDist",
    "nameAlt": None
  },
  {
    "id": "nycongress",
    "datasetName": "Congressional Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/congressional/nycg_25a.zip",
    "nameCol": "CongDist",
    "nameAlt": None
  },
  {
    "id": "sa",
    "datasetName": "State Assembly Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/state-assembly/nyad_25a.zip",
    "nameCol": "AssemDist",
    "nameAlt": None
  },
  {
    "id": "ss",
    "datasetName": "State Senate Districts",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/state-senate/nyss_25a.zip",
    "nameCol": "StSenDist",
    "nameAlt": None
  },
  {
    "id": "bid",
    "datasetName": "Business Improvement District",
    "url": "https://data.cityofnewyork.us/resource/7jdm-inj8.geojson",
    "nameCol": "f_all_bi_2",
    "nameAlt": None
  },
  {
    "id": "nta",
    "datasetName": "Neighborhood Tabulation Areas",
    "url": "https://s-media.nyc.gov/agencies/dcp/assets/files/zip/data-tools/bytes/neighborhood-tabulation-areas/nynta2020_25a.zip",
    "nameCol": "NTAName",
    "nameAlt": "NTA2020"
  },
  {
    "id": "zipcode",
    "datasetName": "Zip Codes",
    "url": "https://data.cityofnewyork.us/api/geospatial/pri4-ifjk?method=export&format=Shapefile",
    "nameCol": "modzcta",
    "nameAlt": None
  },
  {
    "id": "hd",
    "datasetName": "Historic Districts",
    "url": "https://data.cityofnewyork.us/resource/skyk-mpzq.geojson",
    "nameCol": "area_name",
    "nameAlt": None
  },
  {
    "id": "ibz",
    "datasetName": "Industrial Business Zones",
    "url": "https://services5.arcgis.com/OKgEWPlJhc3vFb8C/arcgis/rest/services/Industrial_Business_Zones_IBZ/FeatureServer/0/query?where=0%3D0&outFields=*&f=geojson",
    "nameCol": "name",
    "nameAlt": None
  },
  {
    "id": "uhf",
    "datasetName": "UHF 42 Neighborhoods",
    "url": "https://raw.githubusercontent.com/nychealth/EHDP-data/refs/heads/production/geography/UHF42.geojson",
    "nameCol": "GEONAME",
    "nameAlt": None
  },
  {
    "id": "puma",
    "datasetName": "PUMAs",
    "url": "https://data.cityofnewyork.us/resource/pikk-p9nv.geojson",
    "nameCol": "puma",
    "nameAlt": None
  },
  {
    "id": "cdta",
    "datasetName": "CDTAs",
    "url": "https://data.cityofnewyork.us/resource/xn3r-zk6y.geojson",
    "nameCol": "cdta2020",
    "nameAlt": "cdtaname"
  },
  {
    "id": "ps",
    "datasetName": "Police Precinct Sectors",
    "url": "https://data.cityofnewyork.us/resource/5rqd-h5ci.geojson",
    "nameCol": "sector",
    "nameAlt": None
  },
  {
    "id": "nda",
    "datasetName": "Neighborhood Development Areas",
    "url": "https://data.cityofnewyork.us/resource/vd7c-qjsx.geojson",
    "nameCol": None,
    "nameAlt": None
  },
  {
    "id": "ed",
    "datasetName": "Election Districts",
    "url": "https://data.cityofnewyork.us/api/v3/views/wwxk-38u4/query.geojson",
    "nameCol": "elect_dist",
    "nameAlt": None 
  },
  {
    "id": "mc",
    "datasetName": "Municipal Court Districts",
    "url": "https://data.cityofnewyork.us/resource/mi5z-t7dx.geojson",
    "nameCol": None,
    "nameAlt": None
  }
]

# Create mapping dictionary for NDA nameCol creation
borough_prefix = {
    "Bronx": "2",
    "Brooklyn": "3",
    "Manhattan": "1",
    "Queens": "4",
    "Richmond": "5"
}

def process_dataset(dataset_info: dict) -> Union[geopandas.GeoDataFrame, None]:
    """Downloads, reads, and standardizes a single dataset."""
    dataset_id = dataset_info['id']
    url = dataset_info['url']
    headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    name_col_key = dataset_info['nameCol']
    name_alt_key = dataset_info.get('nameAlt') # Use .get for safety

    logging.info(f"Processing dataset: {dataset_id} ({dataset_info['datasetName']}) from {url}")

    gdf = None # Initialize gdf

    # --- Read GeoJSON directly if URL ends with geojson ---
    if url.lower().endswith('geojson'):
        logging.info(f"Attempting to read GeoJSON directly from URL: {url}")
        try:
            gdf = geopandas.read_file(url)
            logging.info(f"Successfully read GeoJSON for {dataset_id} directly from URL.")
            # Proceed directly to Reproject step
        except Exception as e:
            logging.error(f"Failed to read GeoJSON directly from {url}. Error: {e}")
            logging.info("Retrying with authentication...")

            # Try with authentication
            if not SOCRATA_API_KEY or not SOCRATA_API_SECRET:
                logging.error("No Socrata credentials available for authenticated retry.")
                return None

            try:
                response = requests.get(
                    url,
                    auth = (SOCRATA_API_KEY, SOCRATA_API_SECRET),
                    timeout = 30
                )
                response.raise_for_status()

                # Read GeoJSON from response content
                gdf = geopandas.read_file(response.text)
                logging.info(f"Successfully read GeoJSON for {dataset_id} with authentication.")
            except Exception as e:
                logging.error(f"Failed to read authenticated GeoJSON. Error: {e}")
                return None # Exit if direct GeoJSON read fails
    else:
        # --- Download and Process Zip (existing logic) ---
        logging.info(f"URL does not end with geojson, attempting zip download and processing for {dataset_id}")
        # --- Download ---
        try:
            response = requests.get(url, headers = headers, stream=False, timeout=60) # Added timeout
            response.raise_for_status()
            zip_content = io.BytesIO(response.content)
            logging.info(f"Downloaded zip for {dataset_id} successfully.")
        except requests.exceptions.RequestException as e:
          logging.warning(f"requests failed for {dataset_id} from {url}. Error: {e}. Trying curl fallback...")

        # --- Read Shapefile from Zip ---  (MODIFIED LOGIC)
        try:
            zip_content.seek(0)  # Ensure buffer is at the start

            with tempfile.TemporaryDirectory() as temp_dir:
                logging.info(f"Extracting zip contents for {dataset_id} to temporary directory: {temp_dir}")
                shapefile_path_in_zip = None
                extracted_shp_path = None

                try:
                    with zipfile.ZipFile(zip_content, 'r') as zip_ref:
                        # Find the .shp file within the zip, potentially in a subdirectory
                        for member in zip_ref.namelist():
                            if member.lower().endswith('.shp'):
                                shapefile_path_in_zip = member
                                logging.info(f"Found shapefile inside zip: {shapefile_path_in_zip}")
                                break  # Assume first .shp file found is the correct one

                        if not shapefile_path_in_zip:
                            logging.error(f"No .shp file found inside the zip archive for {dataset_id}.")
                            return None

                        # Extract necessary files (.shp, .dbf, .shx, potentially .prj)
                        shp_basename = os.path.splitext(shapefile_path_in_zip)[0]
                        required_extensions = ['.shp', '.dbf', '.shx', '.prj'] # .prj is often needed for CRS
                        extracted_files_count = 0
                        for member in zip_ref.namelist():
                            # Handle potential subdirectories: compare basenames relative to their directory
                            member_dir = os.path.dirname(member)
                            member_basename_rel = os.path.splitext(os.path.basename(member))[0]
                            shp_basename_rel = os.path.splitext(os.path.basename(shapefile_path_in_zip))[0]
                            member_ext = os.path.splitext(member)[1]

                            # Check if file is in the same (potentially root) directory and has the same base name
                            if os.path.dirname(shapefile_path_in_zip) == member_dir and \
                               member_basename_rel == shp_basename_rel and \
                               member_ext.lower() in required_extensions:

                                # Extract preserving filename
                                zip_ref.extract(member, path=temp_dir)
                                logging.debug(f"Extracted {member} to {temp_dir}")
                                extracted_files_count += 1
                                if member.lower().endswith('.shp'):
                                    # Construct the full path to the extracted .shp file
                                    extracted_shp_path = os.path.join(temp_dir, member)

                        if not extracted_shp_path:
                            logging.error(f"Shapefile was found ({shapefile_path_in_zip}) but could not determine extracted path in {temp_dir}.")
                            return None

                        if extracted_files_count < 3: # Need at least .shp, .shx, .dbf
                            logging.warning(f"Extracted only {extracted_files_count} files for {shp_basename}. Reading might fail.")

                        logging.info(f"Attempting to read extracted shapefile: {extracted_shp_path}")
                        gdf = geopandas.read_file(extracted_shp_path)
                        logging.info(f"Successfully read {dataset_id} from extracted shapefile.")

                except zipfile.BadZipFile:
                    logging.error(f"Invalid or corrupted zip file for {dataset_id}.")
                    return None
                except FileNotFoundError:
                    logging.error(f"Extracted shapefile path not found after extraction: {extracted_shp_path}")
                    return None
                except Exception as extract_read_e:
                    # Catch potential geopandas read errors here too
                    logging.error(f"Error during zip extraction or reading extracted file for {dataset_id}. Error: {extract_read_e}")
                    return None
            # End of with tempfile.TemporaryDirectory() - temp_dir is automatically cleaned up here

        except Exception as e:
            # This outer exception is less likely now, but kept as a failsafe
            logging.error(f"Unexpected error during shapefile processing setup for {dataset_id}. Error: {e}")
            return None

        # If gdf is still None after the zip processing block, handle error
        if gdf is None:
            logging.error(f"Failed to obtain GeoDataFrame for {dataset_id} via zip processing.")
            return None
    # --- END of if/else for GeoJSON vs Zip ---

    # --- Reproject (Runs for both GeoJSON and Shapefile reads) ---
    if gdf is None: # Should ideally not happen if logic above is correct, but safety check
        logging.error(f"GDF is None before reprojection for {dataset_id}. Cannot proceed.")
        return None

    try:
        if gdf.crs is None:
            # Try to infer CRS if possible, otherwise assume 4326 if read from GeoJSON, or 2263 if likely from shapefile
            default_crs = 'EPSG:4326' if url.lower().endswith('.geojson') else 'EPSG:2263'
            logging.warning(f"CRS is missing for {dataset_id}. Assuming {default_crs} and attempting reproject to EPSG:4326.")
            try:
                 gdf = gdf.set_crs(default_crs, allow_override=True).to_crs('EPSG:4326')
                 logging.info(f"Assumed {default_crs} and reprojected {dataset_id} to EPSG:4326.")
            except Exception as crs_e:
                 logging.error(f"Failed to assume and reproject CRS for {dataset_id}. Error: {crs_e}. Setting to None.")
                 return None # Cannot proceed reliably without CRS
        elif gdf.crs != 'EPSG:4326':
            logging.info(f"Reprojecting {dataset_id} from {gdf.crs} to EPSG:4326.")
            gdf = gdf.to_crs('EPSG:4326')
        else:
            logging.info(f"{dataset_id} is already in EPSG:4326.")
    except Exception as e:
        logging.error(f"Error during reprojection for {dataset_id}. Error: {e}")
        return None

    # --- Standardize Properties ---
    try:
        # Check if 'geometry' column exists, needed for GeoDataFrame
        if 'geometry' not in gdf.columns:
             # Sometimes GeoJSON might use a different name, like 'the_geom'
             geom_col_found = None
             potential_geom_cols = ['the_geom', 'geom', 'shape'] # Add others if needed
             for col in potential_geom_cols:
                  if col in gdf.columns:
                       logging.warning(f"Geometry column named '{col}' found for {dataset_id}, renaming to 'geometry'.")
                       gdf = gdf.rename(columns={col: 'geometry'})
                       gdf = gdf.set_geometry('geometry') # Ensure it's the active geometry column
                       geom_col_found = True
                       break
             if not geom_col_found:
                  logging.error(f"'geometry' column (or recognized alternative) not found in {dataset_id} after reading. Columns: {gdf.columns.tolist()}")
                  return None

        processed_gdf = geopandas.GeoDataFrame(geometry=gdf.geometry.make_valid(), crs='EPSG:4326')
        processed_gdf['id'] = dataset_id

        # Add nameCol
        if name_col_key not in gdf.columns:
            # For NDA, MC: Derive namecol from Borough, boundary number to mimic CD format
            if dataset_id == 'nda':
                processed_gdf['nameCol'] = (
                    gdf['borough'].map(borough_prefix) + 
                    gdf['nda'].astype(str).str.replace('.0', '', regex = False).str.zfill(2)
                )
            elif dataset_id == 'mc':
                processed_gdf['nameCol'] = (
                    gdf['boro_code'].astype(str) + 
                    gdf['muni_court'].astype(str)
                )
            else:    
                logging.warning(f"nameCol '{name_col_key}' not found in {dataset_id}. Columns: {gdf.columns.tolist()}. Setting column to None.")
                processed_gdf['nameCol'] = None
        else:
            processed_gdf['nameCol'] = gdf[name_col_key].fillna('').astype(str)

        # Add nameAlt (conditionally)
        final_columns = ['id', 'nameCol', 'geometry']
        if name_alt_key and name_alt_key in gdf.columns:
            logging.info(f"Found nameAlt column '{name_alt_key}' for {dataset_id}.")
            processed_gdf['nameAlt'] = gdf[name_alt_key].fillna('').astype(str)
            final_columns.insert(2, 'nameAlt') # Insert 'nameAlt' before 'geometry'

        # Filter to essential columns
        processed_gdf = processed_gdf[final_columns]
        logging.info(f"Standardized properties for {dataset_id}.")

    except KeyError as e:
         logging.error(f"KeyError during property standardization for {dataset_id}. Missing column: {e}. Available: {gdf.columns.tolist()}")
         return None
    except Exception as e:
         logging.error(f"Unexpected error during property standardization for {dataset_id}. Error: {e}")
         return None

    return processed_gdf

# --- Main Execution Block ---
if __name__ == "__main__":
    logging.info("Starting dataset processing...")

    # --- Create output directory if it doesn't exist ---
    output_dir = "data/processed"
    os.makedirs(output_dir, exist_ok=True)
    logging.info(f"Ensured output directory exists: {output_dir}")

    all_processed_gdfs = []
    failed_datasets = []

    # --- Process ALL datasets ---
    for dataset_info in datasets:
        logging.info("\n--- Processing dataset: %s ---", dataset_info['id'])
        result_gdf = process_dataset(dataset_info)

        if result_gdf is not None:
            logging.info(f"Successfully processed {dataset_info['id']}.")
            print(f"\n--- Preview for {dataset_info['id']} ---")
            print(result_gdf.head())
            all_processed_gdfs.append(result_gdf)

             # --- Save individual GeoJSON ---
            output_path = os.path.join(output_dir, f"{dataset_info['id']}.geojson")
            try:
                result_gdf.to_file(output_path, driver='GeoJSON')
                logging.info(f"Saved {dataset_info['id']} to {output_path}")
            except Exception as e:
                logging.error(f"Failed to save {dataset_info['id']} to GeoJSON. Error: {e}")
                failed_datasets.append(f"{dataset_info['id']} (Save Error: {e})")

        else:
            logging.error(f"--- Processing failed for {dataset_info['id']} ---")
            failed_datasets.append(dataset_info['id'] + " (Processing Error)")


    # --- Combine all processed datasets ---
    if all_processed_gdfs:
        logging.info("\n--- Combining all successfully processed datasets ---")
        combined_gdf = pd.concat(all_processed_gdfs, ignore_index=True)
        combined_gdf = geopandas.GeoDataFrame(combined_gdf, crs='EPSG:4326') # Ensure it's still a GeoDataFrame

        logging.info("Combined GeoDataFrame Info:")
        print(combined_gdf.info())
        print("\nCombined GeoDataFrame Head:")
        print(combined_gdf.head())
        print("\nCombined GeoDataFrame Tail:")
        print(combined_gdf.tail())

        # --- Save Combined GeoJSON ---
        combined_output_path = os.path.join(output_dir, "all_boundaries.geojson")
        try:
            combined_gdf.to_file(combined_output_path, driver='GeoJSON')
            logging.info(f"Saved combined boundaries to {combined_output_path}")
        except Exception as e:
            logging.error(f"Failed to save combined boundaries GeoJSON. Error: {e}")
            failed_datasets.append(f"all_boundaries.geojson (Save Error: {e})")
    else:
        logging.warning("No datasets were processed successfully. Cannot create combined file.")


    # --- Summary ---
    logging.info("\n--- Processing Summary ---")
    total_datasets = len(datasets)
    successful_count = len(all_processed_gdfs)
    failed_count = len(failed_datasets)
    logging.info(f"Total datasets defined: {total_datasets}")
    logging.info(f"Successfully processed and saved: {successful_count}")
    logging.info(f"Failed datasets ({failed_count}): {', '.join(failed_datasets) if failed_datasets else 'None'}")

    logging.info("Finished dataset processing.")