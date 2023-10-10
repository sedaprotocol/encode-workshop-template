import { Process, httpFetch, JSON } from "@seda-protocol/as-sdk/assembly";

function main(): void {
  const response = httpFetch("https://swapi.dev/api/planets/1/");
  const fulfilled = response.fulfilled;

  if (fulfilled !== null) {
    const jsonResponse = fulfilled.json();

    if (jsonResponse.isObj) {
      const obj = <JSON.Obj>jsonResponse;
      const name = obj.getString("name");

      if (name !== null) {
        Process.exit_with_message(0, name.valueOf());
      } else {
        Process.exit_with_message(1, "Object 'name' is null");
      }
    } else {
      Process.exit_with_message(1, "Error JSON response was not an object");
    }
  } else {
    Process.exit_with_message(1, "Error while fetching");
  }
}

main();
