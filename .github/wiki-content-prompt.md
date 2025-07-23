# Wiki Content Integration Guidelines

## MediaWiki API Integration

### Content Fetching
```typescript
// Use existing utility functions
import { fetchAllEntries, fetchPageContent } from "@/lib/fetchData";

// ✅ Server Component data fetching
export default async function WikiPage({ params }: { params: { title: string } }) {
  const content = await fetchPageContent(params.title);
  // Handle content rendering
}
```

### API Response Handling
- Check for `data.parse` and `data.parse.text` before accessing content
- Convert relative URLs to absolute URLs for images and resources
- Handle missing pages gracefully with user-friendly messages
- Implement proper error boundaries for API failures

## Content Rendering Patterns

### Safe HTML Rendering
```typescript
// ✅ Render wiki HTML content
<div 
  className={styles.text}
  dangerouslySetInnerHTML={{ __html: content }} 
/>
```

### Content Processing
```typescript
// URL conversion for images
content = content.replace(/src="\/images\//g, `src="${BASE_URL}images/`);
content = content.replace(/srcset="\/images\//g, `srcset="${BASE_URL}images/`);
```

## Wiki Page Structure

### Page Layout
```typescript
// Standard wiki page layout
<div className={styles.container}>
  <h1 className={styles.title}>{title.replace("_", " ")}</h1>
  
  {/* Feedback integration */}
  <div className={styles.feedbackContainer}>
    <Link href={`/posts?wiki=${encodeURIComponent(title)}`}>
      Provide Feedback on this Article
    </Link>
  </div>
  
  {/* Wiki content */}
  <div className={styles.text} dangerouslySetInnerHTML={{ __html: content }} />
</div>
```

## Content-Related Features

### Wiki Entry Listing
- Use `fetchAllEntries()` for getting all available pages
- Implement card-based layouts for browsing
- Handle pagination if needed for large datasets

### Content Search and Filtering
- Filter posts by wiki article association
- Implement dropdown filters for content categories
- Use URL parameters for shareable filtered views

### Feedback Integration
- Associate user posts with specific wiki articles
- Use hidden form inputs to link content: `<input type="hidden" name="wikiArticle" value={wikiFilter} />`
- Display article-specific feedback counts

## Error Handling

### Missing Pages
```typescript
// Graceful error handling in fetchPageContent
try {
  const data = await response.json();
  if (data.parse && data.parse.text) {
    return processContent(data.parse.text["*"]);
  } else {
    throw new Error("Unexpected response structure");
  }
} catch (error) {
  return "This page does not exist. Check if the title corresponds to the article's title on the WikiMethods page.";
}
```

### Content Validation
- Validate HTML content before rendering
- Handle malformed or missing content gracefully
- Provide fallback content for failed requests

## Content Styling

### Wiki-Specific CSS
```css
.container {
  max-width: 95vw;
  margin: 20px auto;
  line-height: 1.8;
}

.text img {
  max-width: 100%;
  height: auto;
  margin: 10px 0;
}

.text a {
  color: #007bff;
  text-decoration: none;
}
```

## Data Extraction for Visualizations
- Parse wiki content to extract structured data
- Identify relationships between methods and concepts
- Transform wiki markup into visualization-ready formats
- Handle inconsistent content structures gracefully