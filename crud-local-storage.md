# CRUD With Local Storage

## Overview

This project uses a hybrid product data strategy:

- The API supplies the original product and category data.
- Browser `localStorage` stores product changes made by the user.
- The catalog combines API products with the local changes before rendering them.

This approach allows the CRUD workflow to work even when the remote API is only a demo API and does not permanently save mutations.

## Storage Key

All local product changes are stored in the browser under:

```text
productOverrides
```

The stored JSON has this shape:

```ts
{
  edited: {
    "1": { "title": "Updated title", "price": 25 }
  },
  deleted: [2, 5],
  created: [
    {
      "id": "new- timestamp",
      "title": "New product",
      "category": "beauty",
      "price": 20,
      "stock": 10,
      "description": "Product description"
    }
  ]
}
```

The generated ID for a locally created product starts with `new-` and is based on the current timestamp.

## Read Flow

1. Request products from the API.
2. Read `productOverrides` from `localStorage`.
3. Remove API products whose IDs are in `deleted`.
4. Merge matching `edited` fields into API products.
5. Add locally created products to the catalog.
6. Render the final combined list.

The main helper for the catalog is `applyOverrides`.

For a product details or edit page:

1. Check whether the product exists in the local `created` list.
2. If it exists locally, use the local product.
3. Otherwise, request the product from the API.
4. Apply edits and deletion status with `getSingleWithOverrides`.

## Create Flow

When the user submits the add-product form:

1. Send the product data to the API.
2. Combine the response with the submitted values.
3. Save the product in the local `created` list with `recordCreate`.
4. Redirect to the catalog.
5. The catalog displays the new product from local storage.

The local record is the durable source for the user experience because the demo API may not persist the new product.

## Update Flow

When the user saves an edited product:

1. Send the updated values to the API.
2. Save only the changed fields in `edited` with `recordEdit`.
3. Redirect to the catalog.
4. Merge the saved fields with the API product when it is displayed again.

Saving only changed fields keeps the local override small and allows the API to continue providing untouched fields.

## Delete Flow

When the user confirms deletion:

1. Send the delete request to the API.
2. Add the product ID to `deleted` with `recordDelete`.
3. Reload the catalog.
4. Filter the deleted product out of API results.

Deleted IDs are checked as strings so numeric API IDs and string IDs work consistently.

## Why This Design Is Used

The project uses this design because the API is used mainly as a product data source. A demo API can accept create, update, and delete requests without providing permanent shared persistence. Local storage gives the current browser a consistent CRUD experience without adding a backend database.

## Important Limitations

- Changes are stored only in the current browser and device.
- Another user or browser will not see the changes.
- Clearing browser storage removes local product changes.
- Local storage should not be used for sensitive data.
- A production application should replace this layer with a real backend and database.

## Testing Checklist

- Create a product and confirm it appears after returning to the catalog.
- Refresh the page and confirm the created product remains.
- Edit an API product and confirm the edited values remain after refresh.
- Delete a product and confirm it remains hidden after refresh.
- Open a locally created product and confirm its edit page loads.
- Clear `productOverrides` from browser storage and confirm the catalog returns to API data.
