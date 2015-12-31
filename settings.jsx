export default {
  // Enable server-side rendering
  // @todo doesn't work with publish_composite : https://github.com/thereactivestack/meteor-react-router-ssr/issues/16
  ssr: false,
  // Enable redux DevTools
  // Note : when used with SSR, this causes "React attempted to reuse markup in
  // a container but the checksum was invalid" warnings.
  debug: false
}
