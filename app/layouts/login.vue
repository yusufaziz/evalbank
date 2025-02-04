<script lang="ts" setup>
</script>

<template>
  <div class="relative flex h-screen items-center">
    <div
      class="absolute h-full w-full bg-[radial-gradient(theme(colors.border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"
    />
    <div class="container relative z-[1] flex flex-col items-center justify-center text-center">
      <p class="mb-5 font-bold tracking-tight text-primary">
        We are preparing you to login
      </p>
      <h1 class="text-4xl font-bold tracking-tight lg:text-5xl">
        <slot />
      </h1>
    </div>
  </div>
</template>
