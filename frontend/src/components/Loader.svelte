<div
  class="bg-gray-200 w-full h-1 inline-block relative overflow-hidden rounded-sm"
>
  <div class="loader bg-blue-500 w-48 h-1 absolute top-0 left-0" />
</div>

<style>
  .loader {
    animation: animloader 2s linear infinite;
  }

  @keyframes animloader {
    0% {
      left: 0;
      transform: translateX(-100%);
    }
    100% {
      left: 100%;
      transform: translateX(0%);
    }
  }
</style>
