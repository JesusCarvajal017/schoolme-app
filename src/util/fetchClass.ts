import AsyncStorage from "@react-native-async-storage/async-storage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class Petitioner {
  private _response: any;

  private async buildHeaders(hasBody: boolean): Promise<Record<string, string>> {
    const token = await AsyncStorage.getItem("token");
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (hasBody) {
      headers["Content-Type"] = "application/json";
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return headers;
  }

  async command<T = any>(url: string, data: unknown, method: HttpMethod): Promise<T> {
    try {
      const hasBody = method !== "GET";
      const headers = await this.buildHeaders(true);

      const resp = await fetch(url, {
        method,
        headers,
        body: hasBody ? JSON.stringify(data ?? {}) : undefined,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status} - ${text || resp.statusText}`);
      }

      const contentType = resp.headers.get("content-type") || "";
      const json = contentType.includes("application/json") ? await resp.json() : (undefined as unknown as T);
      this._response = json;
      return this._response as T;
    } catch (error) {
      this._response = error;
      throw error;
    }
  }

  /** Solo GET */
  async querys<T = any>(url: string): Promise<T> {
    try {
      const headers = await this.buildHeaders(false);

      const resp = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`HTTP ${resp.status} - ${text || resp.statusText}`);
      }

      const contentType = resp.headers.get("content-type") || "";
      const json = contentType.includes("application/json") ? await resp.json() : (undefined as unknown as T);
      this._response = json;
      return this._response as T;
    } catch (error) {
      this._response = error;
      throw error;
    }
  }
}
