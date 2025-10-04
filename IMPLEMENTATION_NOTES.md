# Product Sizes & Colors Implementation

## Overview
This implementation adds the ability to display available sizes and colors for F&F clothing products in the white overlay that appears when hovering or tapping on a product card.

## What Was Implemented

### 1. TypeScript Types (`src/lib/tesco.ts`)
Added new interfaces to support the actual Tesco API structure for product variants:

```typescript
export interface VariationAttribute {
  name: string
  value: string
  __typename?: string
}

export interface AttributeGroupData {
  name: string
  value: string
  attributes: VariationAttribute[]
  __typename?: string
}

export interface VariationAttributeType {
  attributeGroup: string  // "colour" or "size"
  attributeGroupData: AttributeGroupData
  __typename?: string
}

export interface ProductVariation {
  id: string
  tpnc: string
  title: string
  variationAttributes?: VariationAttributeType[]
  sellers?: {
    results: Array<{
      isForSale: boolean
      status: string
    }>
  }
}

export interface GetProductResponse {
  product: {
    id: string
    baseProductId: string
    title: string
    variations?: {
      products: ProductVariation[]
    }
  }
}
```

### 2. GraphQL Queries (`src/lib/tesco.ts`)

#### Search Query
Enhanced the existing `SEARCH_PRODUCTS_QUERY` to include `variationAttributes`:

```graphql
fragment ProductItem on ProductInterface {
  # ... other fields
  variationAttributes {
    attributeGroup
    attributeGroupData {
      name
      value
      attributes {
        name
        value
      }
    }
  }
}
```

#### GetProduct Query
Added a new `GET_PRODUCT_QUERY` to fetch all variations (sizes/colors):

```graphql
query GetProduct($tpnc: String!) {
  product(tpnc: $tpnc) {
    id
    baseProductId
    title
    variations {
      products {
        id
        tpnc
        variationAttributes {
          attributeGroup
          attributeGroupData {
            name
            value
          }
        }
        sellers {
          results {
            isForSale
            status
          }
        }
      }
    }
  }
}
```

**Important**: The parameter is `$tpnc: String!` (not `$id: ID!`)

### 3. API Method (`src/lib/tesco.ts`)
Added `TescoAPI.getProduct()` method:
```typescript
static async getProduct(options: { tpnc: string }) {
  const variables = { tpnc: options.tpnc }
  return graphqlRequest<GetProductResponse>(GET_PRODUCT_QUERY, variables, this.proxyUrl)
}
```

### 4. UI Updates (`src/components/Search.tsx`)

#### Added State Management
- `productVariations` - Caches fetched variations for each product

#### Added Fetch Function
- `fetchProductVariations()` - Asynchronously loads all size/color variations when hovering/tapping

#### Updated Event Handlers
- `onMouseEnter` - Fetches product variations for F&F products on hover
- `onTouchEnd` - Fetches product variations for F&F products on tap

#### Enhanced White Overlay
The white overlay now displays:
- **Available Colours** - Shows all available colors
- **Available Sizes** - Shows all available sizes sorted numerically (6, 8, 10, 12, etc.)
- Visual indicators for:
  - Current product's variant (black background, white text)
  - Available variants (white background, gray border)
  - Unavailable variants (gray background, strikethrough)

## How It Works

### Two-Step Data Flow

1. **Search Results** - Provide basic product info:
   - Each product has its own size/color in `variationAttributes`
   - Example: Product shows it's size "16" in "Burgundy"

2. **GetProduct Query** - Fetches all variations:
   - Called on hover/tap for F&F products
   - Returns `variations.products` array with all sizes
   - Each variation includes availability status

### Display Logic
When hovering/tapping a product card:
1. Get current product's size and color from `variationAttributes`
2. Call `fetchProductVariations()` to load all available sizes/colors
3. Parse the `variations.products` array
4. Extract sizes, colors, and availability status
5. Display them with current variant highlighted in black

## Visual Design
- Small, compact chips with rounded borders
- Black selection indicator matching F&F branding
- Sorted sizes (6, 8, 10, 12, etc.)
- Responsive layout that wraps on smaller screens

## Testing

### Expected Behavior
1. Search for F&F clothing products (e.g., "dress")
2. Hover over or tap a product card
3. The white overlay should appear showing:
   - Product title
   - Price
   - Thumbnail images
   - **Colour**: Current color highlighted
   - **Sizes**: All available sizes with current size highlighted

## Example Data Structure

### Search Results
Each product in the search results has:
```json
{
  "id": "321744130",
  "baseProductId": "96761162",
  "title": "F&F Geometric Print Long Sleeved Mini Dress in Burgundy",
  "variationAttributes": [
    {
      "attributeGroup": "colour",
      "attributeGroupData": {
        "name": "specificColour",
        "value": "Burgundy"
      }
    },
    {
      "attributeGroup": "size",
      "attributeGroupData": {
        "name": "size",
        "value": "16"
      }
    }
  ]
}
```

### Multiple Variants
When searching for "dress", you get multiple products with the same `baseProductId` but different sizes:
- Product 1: baseProductId="96761162", size="6"
- Product 2: baseProductId="96761162", size="8"
- Product 3: baseProductId="96761162", size="10"
- etc.

## Color Scheme
- F&F Products: Black theme (`border-black`, `bg-black`)
- Current variant: Black background, white text
- Other variants: White background, gray border

## Browser Compatibility
- Uses modern CSS (flexbox)
- Tailwind CSS for styling
- Works on mobile and desktop
- Touch and mouse event support
- No external API calls needed (data already in search results)


