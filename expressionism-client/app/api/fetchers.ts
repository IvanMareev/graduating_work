import ky from "ky";

const kyApi = ky.create({ prefixUrl: "/api" });

const fetcherGet = async (url: string) => await kyApi.get(url).json<any>();

const fetcherPost = async (url: string, data: any) =>
    await kyApi.post(url, { json: data }).json<any>();

const fetcherPatch = async (url: string, data: any) =>
    await kyApi.patch(url, { json: data }).json<any>();

const fetcherDelete = async (url: string) => await kyApi.delete(url).json<any>();

export { fetcherDelete, fetcherGet, fetcherPatch, fetcherPost, kyApi };
