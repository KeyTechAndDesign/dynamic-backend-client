// Blog Operations Example for Dynamic Backend Client
// This example demonstrates how to work with blog posts, categories, tags, and comments

// Import the client classes
import { ApiClient, BlogClient } from '@keytd/dynamic-backend-client';

// Create the base API client
const apiClient = new ApiClient({
  baseUrl: 'https://api.example.com',
  schema: 'public'
});

// Create the blog client
const blogClient = new BlogClient(apiClient);

// Example: Get blog posts with pagination and filtering
async function getBlogPosts() {
  try {
    // Get published posts from the first page with 10 posts per page
    const posts = await blogClient.getPosts({
      page: 1,
      page_size: 10,
      status: 'published',
      include_tags: true
    });

    console.log(`Found ${posts.pagination.total} posts in total`);
    console.log(`Showing page ${posts.pagination.page} of ${posts.pagination.total_pages}`);
    
    // Display post titles
    posts.data.forEach(post => {
      console.log(`- ${post.title} (${post.published_at})`);
      
      // If tags are included, display them
      if (post.tags && post.tags.length > 0) {
        console.log('  Tags:', post.tags.map(tag => tag.name).join(', '));
      }
    });

    return posts;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
  }
}

// Example: Get a specific post by slug with comments
async function getPostWithComments(slug) {
  try {
    // Get the post with tags and comments
    const post = await blogClient.getPostBySlug(slug, {
      include_tags: true,
      include_comments: true
    });

    console.log(`Post: ${post.title}`);
    console.log(`Published: ${post.published_at}`);
    console.log(`Content: ${post.content.substring(0, 100)}...`);
    
    // Display tags if available
    if (post.tags && post.tags.length > 0) {
      console.log('Tags:', post.tags.map(tag => tag.name).join(', '));
    }
    
    // Display comments if available
    if (post.comments && post.comments.length > 0) {
      console.log(`\nComments (${post.comments.length}):`);
      post.comments.forEach(comment => {
        console.log(`- ${comment.author} (${comment.created_at}):`);
        console.log(`  ${comment.content}`);
      });
    } else {
      console.log('\nNo comments yet.');
    }

    return post;
  } catch (error) {
    if (error.status === 404) {
      console.error(`Post with slug "${slug}" not found`);
    } else {
      console.error('Error fetching post:', error.message);
    }
  }
}

// Example: Get blog categories and their posts count
async function getBlogCategories() {
  try {
    const categories = await blogClient.getCategories();
    
    console.log('Blog Categories:');
    categories.forEach(category => {
      console.log(`- ${category.name} (${category.posts_count} posts)`);
      if (category.description) {
        console.log(`  ${category.description}`);
      }
    });

    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
  }
}

// Example: Get blog tags with multilingual support
async function getBlogTagsMultilingual() {
  try {
    // Get tags in English
    const englishTags = await blogClient.getTags({ lang: 'en' });
    console.log('Tags (English):', englishTags.map(tag => tag.name).join(', '));
    
    // Get the same tags in Spanish
    const spanishTags = await blogClient.getTags({ lang: 'es' });
    console.log('Tags (Spanish):', spanishTags.map(tag => tag.name).join(', '));
    
    return { englishTags, spanishTags };
  } catch (error) {
    console.error('Error fetching tags:', error.message);
  }
}

// Run the examples
(async () => {
  console.log('Starting blog operations examples...');
  
  await getBlogPosts();
  console.log('\n---\n');
  
  await getPostWithComments('welcome-to-our-blog');
  console.log('\n---\n');
  
  await getBlogCategories();
  console.log('\n---\n');
  
  await getBlogTagsMultilingual();
  
  console.log('\nBlog operations examples completed!');
})();