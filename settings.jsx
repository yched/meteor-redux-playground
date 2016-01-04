export default {
  // Enable server-side rendering
  // Note : Kind of useless with publish-composite until this is fixed:
  // https://github.com/thereactivestack/meteor-react-router-ssr/issues/16#issuecomment-168627720
  // https://github.com/englue/meteor-publish-composite/issues/67
  ssr: false,
  // Enable redux DevTools
  // Note : when used with SSR, this causes "React attempted to reuse markup in
  // a container but the checksum was invalid" warnings.
  debug: false
}
