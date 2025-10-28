import { fetchHelper } from "../lib/fetch-helper";

export type UploadedFiles = {
  message: string;
  data: {
    name: string;
    path: string;
  }[];
};

const FileService = {
  /**
   * Upload a single file to the server
   * @param file
   * @param token - Authentication token
   * @returns Object
   */
  async uploadSingleFile(file: File, token: string) {
    const formData = new FormData();
    formData.append("files[]", file);

    const { data, error } = await fetchHelper<{
      path: string;
      name: string;
      type: string;
      finename: string;
    }>("/files/single", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (error) throw new Error(error);

    return data;
  },

  /**
   * Upload multiple files to the server
   * @param files
   * @param token - Authentication token
   * @returns UploadedFiles
   */
  async uploadMultiFile(files: File[], token: string) {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files[]", file);
    });

    const { data, error } = await fetchHelper<UploadedFiles>(
      "/files/upload-multiple",
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (error) throw new Error(error);
    return data;
  },

  /**
   * Download a file from the server
   * @param path
   * @param token - Authentication token
   * @returns Content of the file
   */
  async loadFile(path: string, token: string): Promise<Blob> {
    const { data, error } = await fetchHelper<Blob>(
      `/files/load?path=${encodeURIComponent(path)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (error) throw new Error(error);
    return data!;
  },

  /**
   * Revert a file from the server
   * @param path
   * @param token - Authentication token
   * @returns void
   */
  async revertFile(path: string, token: string): Promise<void> {
    const { error } = await fetchHelper<void>("/files/revert", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ path }),
    });

    if (error) throw new Error(error);
  },
};

export default FileService;
