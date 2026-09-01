/** Build a `srcSet` for `/path/name.webp` + `/path/name-sm.webp` pairs. */
export function responsiveWebpSrcSet(
  webpPath: string,
  smWidth: number,
  lgWidth: number,
): string {
  const smPath = webpPath.replace(/\.webp$/i, "-sm.webp");
  return `${smPath} ${smWidth}w, ${webpPath} ${lgWidth}w`;
}
