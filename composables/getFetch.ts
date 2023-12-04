export const useGetFetch = (req: string, opts: any) => {
  const config = useRuntimeConfig();

  return useFetch(req, { baseURL: config.public.API_BASE, ...opts });
};
