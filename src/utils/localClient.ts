/**
 * Client for reading and writing data to the local storage.
 */
export const localClient = {
  /**
   * Reads data from the local storage for the given key.
   * @param key - The key to retrieve data from the local storage.
   * @returns The parsed JSON data if available, otherwise an empty array.
   */
  read: (key: string) => {
    // Retrieve data from local storage
    const data = window.localStorage.getItem(key);

    try {
      // Attempt to parse the data as JSON
      return data && JSON.parse(data);
    } catch (error) {
      // If parsing fails, return an empty array
      return [];
    }
  },

  /**
   * Writes data to the local storage for the given key.
   * @param key - The key to store the data in the local storage.
   * @param data - The data to be stored.
   */
  write: (key: string, data: any) => {
    // Convert data to JSON string and store it in local storage
    window.localStorage.setItem(key, JSON.stringify(data));
  },
};
