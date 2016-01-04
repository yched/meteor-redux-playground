export default {
  // Enable server-side rendering
  // Note : Kind of useless with publish-composite until this is fixed
  ssr: true,
  // Enable redux DevTools
  // Note : when used with SSR, this causes "React attempted to reuse markup in
  // a container but the checksum was invalid" warnings.
  debug: false
}
