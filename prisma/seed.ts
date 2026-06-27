import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AI Stack Hub database...\n');

  // ============================================================
  // 1. Clean existing data
  // ============================================================
  await prisma.$transaction([
    prisma.savedWorkflow.deleteMany(),
    prisma.savedTool.deleteMany(),
    prisma.articleTool.deleteMany(),
    prisma.workflowTool.deleteMany(),
    prisma.toolRelation.deleteMany(),
    prisma.article.deleteMany(),
    prisma.workflow.deleteMany(),
    prisma.task.deleteMany(),
    prisma.tool.deleteMany(),
    prisma.toolCapability.deleteMany(),
    prisma.user.deleteMany(),
  ]);
  console.log('✅ Cleaned existing data');

  // ============================================================
  // 2. Create Capabilities
  // ============================================================
  const capabilities = await Promise.all([
    prisma.toolCapability.create({ data: { name: 'Writing', description: 'AI-powered text generation and editing' } }),
    prisma.toolCapability.create({ data: { name: 'Image Generation', description: 'Generate and edit images with AI' } }),
    prisma.toolCapability.create({ data: { name: 'Video', description: 'Video creation and editing' } }),
    prisma.toolCapability.create({ data: { name: 'Coding', description: 'Code generation and debugging' } }),
    prisma.toolCapability.create({ data: { name: 'Data Analysis', description: 'Analyze and visualize data' } }),
    prisma.toolCapability.create({ data: { name: 'Research', description: 'Research and information gathering' } }),
    prisma.toolCapability.create({ data: { name: 'Marketing', description: 'Marketing content and strategy' } }),
    prisma.toolCapability.create({ data: { name: 'Automation', description: 'Workflow and task automation' } }),
    prisma.toolCapability.create({ data: { name: 'Design', description: 'Graphic and UI design' } }),
    prisma.toolCapability.create({ data: { name: 'Audio', description: 'Audio generation and processing' } }),
    prisma.toolCapability.create({ data: { name: 'Chat', description: 'Conversational AI assistants' } }),
    prisma.toolCapability.create({ data: { name: '3D', description: '3D modeling and rendering' } }),
  ]);
  console.log(`✅ Created ${capabilities.length} capabilities`);

  // ============================================================
  // 3. Create Tools
  // ============================================================
  const toolsData = [
    { name: 'ChatGPT', slug: 'chatgpt', description: 'OpenAI\'s flagship conversational AI. Excels at writing, coding, research, and creative tasks. Supports plugins and GPT-4 vision.', pricing: 'freemium', price: 20.00, rating: 4.8, categories: ['writing', 'coding', 'research'], capNames: ['Writing', 'Coding', 'Research', 'Chat'], featured: true },
    { name: 'Claude', slug: 'claude', description: 'Anthropic\'s AI assistant known for long-context understanding and thoughtful responses. Great for analysis and writing tasks.', pricing: 'freemium', price: 20.00, rating: 4.7, categories: ['writing', 'coding', 'research'], capNames: ['Writing', 'Coding', 'Research', 'Chat'], featured: true },
    { name: 'Midjourney', slug: 'midjourney', description: 'Industry-leading AI image generator. Produces stunning artistic and photorealistic images from text prompts.', pricing: 'paid', price: 10.00, rating: 4.7, categories: ['image'], capNames: ['Image Generation', 'Design'], featured: true },
    { name: 'DALL·E 3', slug: 'dalle3', description: 'OpenAI\'s text-to-image model integrated with ChatGPT. Excellent at following complex prompts and text rendering.', pricing: 'paid', price: 20.00, rating: 4.5, categories: ['image'], capNames: ['Image Generation'], featured: true },
    { name: 'Stable Diffusion', slug: 'stable-diffusion', description: 'Open-source image generation model. Offers maximum control, fine-tuning, and local deployment options.', pricing: 'free', rating: 4.4, categories: ['image'], capNames: ['Image Generation', 'Design'], featured: false },
    { name: 'Runway', slug: 'runway', description: 'AI-powered video editing and generation platform. Features text-to-video, motion tracking, and green screen.', pricing: 'freemium', price: 15.00, rating: 4.3, categories: ['video', 'image'], capNames: ['Video', 'Image Generation'], featured: true },
    { name: 'HeyGen', slug: 'heygen', description: 'AI video generation with realistic avatars. Create talking-head videos in minutes without cameras or studios.', pricing: 'paid', price: 24.00, rating: 4.3, categories: ['video'], capNames: ['Video'], featured: false },
    { name: 'GitHub Copilot', slug: 'github-copilot', description: 'AI pair programmer by GitHub/OpenAI. Autocompletes code, generates functions, and explains code in your IDE.', pricing: 'paid', price: 10.00, rating: 4.7, categories: ['coding'], capNames: ['Coding'], featured: true },
    { name: 'Cursor', slug: 'cursor', description: 'AI-first code editor built on VS Code. Chat with your codebase, inline editing, and context-aware generation.', pricing: 'freemium', price: 20.00, rating: 4.6, categories: ['coding'], capNames: ['Coding'], featured: true },
    { name: 'Replit Ghostwriter', slug: 'replit-ghostwriter', description: 'AI coding assistant integrated into Replit\'s browser IDE. Build full-stack apps with natural language.', pricing: 'freemium', price: 25.00, rating: 4.2, categories: ['coding'], capNames: ['Coding'], featured: false },
    { name: 'Perplexity AI', slug: 'perplexity', description: 'AI-powered search engine with citations. Combines search with LLM for accurate, sourced answers.', pricing: 'freemium', price: 20.00, rating: 4.6, categories: ['research', 'writing'], capNames: ['Research', 'Writing', 'Chat'], featured: true },
    { name: 'Notion AI', slug: 'notion-ai', description: 'AI writing and organization built into Notion. Summarize, brainstorm, translate, and improve writing in your workspace.', pricing: 'paid', price: 10.00, rating: 4.3, categories: ['writing', 'automation'], capNames: ['Writing', 'Automation'], featured: false },
    { name: 'Grammarly', slug: 'grammarly', description: 'AI-powered writing assistant for grammar, tone, clarity, and plagiarism checking across all platforms.', pricing: 'freemium', price: 12.00, rating: 4.7, categories: ['writing'], capNames: ['Writing'], featured: false },
    { name: 'Jasper AI', slug: 'jasper', description: 'Marketing-focused AI writing platform. Templates for ads, blogs, social media, and email campaigns.', pricing: 'paid', price: 49.00, rating: 4.2, categories: ['writing', 'marketing'], capNames: ['Writing', 'Marketing'], featured: false },
    { name: 'Canva AI', slug: 'canva-ai', description: 'AI design tools integrated into Canva. Magic Design, image generation, background removal, and brand kits.', pricing: 'freemium', price: 13.00, rating: 4.5, categories: ['design', 'image', 'marketing'], capNames: ['Design', 'Image Generation', 'Marketing'], featured: false },
    { name: 'ElevenLabs', slug: 'elevenlabs', description: 'State-of-the-art AI voice synthesis. Create natural-sounding speech, clone voices, and generate audiobooks.', pricing: 'freemium', price: 5.00, rating: 4.6, categories: ['audio'], capNames: ['Audio'], featured: false },
    { name: 'Zapier AI', slug: 'zapier-ai', description: 'AI-powered automation platform connecting 6000+ apps. Build workflows with natural language descriptions.', pricing: 'freemium', price: 19.99, rating: 4.4, categories: ['automation'], capNames: ['Automation'], featured: true },
    { name: 'Make (Integromat)', slug: 'make', description: 'Visual automation platform with advanced scenario builder. Complex multi-step automations with error handling.', pricing: 'freemium', price: 9.00, rating: 4.3, categories: ['automation'], capNames: ['Automation'], featured: false },
    { name: 'Descript', slug: 'descript', description: 'All-in-one video and audio editor. Edit media like a document with AI transcription, filler word removal, and screen recording.', pricing: 'freemium', price: 24.00, rating: 4.4, categories: ['video', 'audio'], capNames: ['Video', 'Audio', 'Writing'], featured: false },
    { name: 'Spline AI', slug: 'spline-ai', description: 'AI-powered 3D design tool. Create 3D objects, scenes, and animations with text prompts in the browser.', pricing: 'freemium', price: 9.00, rating: 4.2, categories: ['design'], capNames: ['3D', 'Design'], featured: false },
    { name: 'Replicate', slug: 'replicate', description: 'Cloud platform for running open-source AI models. Access thousands of models via simple API calls.', pricing: 'paid', price: 0.00, rating: 4.5, categories: ['coding', 'image', 'audio'], capNames: ['Coding', 'Image Generation', 'Audio'], featured: false },
    { name: 'Bardeen', slug: 'bardeen', description: 'AI automation agent for browser-based tasks. Scrape data, fill forms, and automate repetitive workflows.', pricing: 'freemium', price: 15.00, rating: 4.1, categories: ['automation', 'research'], capNames: ['Automation', 'Research'], featured: false },
  ];

  const toolMap = new Map<string, string>();
  for (const t of toolsData) {
    const { capNames, ...toolData } = t;
    const tool = await prisma.tool.create({
      data: {
        ...toolData,
        capabilities: {
          connect: capNames.map((name: string) => {
            const cap = capabilities.find((c) => c.name === name);
            return { id: cap!.id };
          }),
        },
      },
    });
    toolMap.set(tool.slug, tool.id);
  }
  console.log(`✅ Created ${toolsData.length} tools`);

  // ============================================================
  // 4. Create Tool Relations
  // ============================================================
  const relationsData: Array<[string, string, 'alternative' | 'complement' | 'combo', number]> = [
    // Alternatives
    ['chatgpt', 'claude', 'alternative', 8],
    ['midjourney', 'dalle3', 'alternative', 7],
    ['midjourney', 'stable-diffusion', 'alternative', 8],
    ['dalle3', 'stable-diffusion', 'alternative', 6],
    ['github-copilot', 'cursor', 'alternative', 9],
    ['github-copilot', 'replit-ghostwriter', 'alternative', 5],
    ['cursor', 'replit-ghostwriter', 'alternative', 5],
    ['zapier-ai', 'make', 'alternative', 7],
    ['chatgpt', 'perplexity', 'alternative', 6],
    ['runway', 'heygen', 'alternative', 5],
    // Complements
    ['chatgpt', 'midjourney', 'complement', 8],
    ['chatgpt', 'runway', 'complement', 6],
    ['claude', 'notion-ai', 'complement', 7],
    ['chatgpt', 'zapier-ai', 'complement', 7],
    ['midjourney', 'canva-ai', 'complement', 8],
    ['github-copilot', 'replicate', 'complement', 6],
    ['chatgpt', 'grammarly', 'complement', 6],
    ['elevenlabs', 'descript', 'complement', 7],
    ['perplexity', 'notion-ai', 'complement', 6],
    ['cursor', 'replicate', 'complement', 6],
    // Combos (work well together in a workflow)
    ['chatgpt', 'canva-ai', 'combo', 8],
    ['chatgpt', 'github-copilot', 'combo', 7],
    ['midjourney', 'runway', 'combo', 7],
    ['claude', 'perplexity', 'combo', 8],
    ['zapier-ai', 'bardeen', 'combo', 7],
    ['descript', 'elevenlabs', 'combo', 8],
    ['chatgpt', 'elevenlabs', 'combo', 6],
  ];

  for (const [sourceSlug, targetSlug, relationType, strength] of relationsData) {
    await prisma.toolRelation.create({
      data: {
        sourceToolId: toolMap.get(sourceSlug)!,
        targetToolId: toolMap.get(targetSlug)!,
        relationType,
        strength,
      },
    });
  }
  console.log(`✅ Created ${relationsData.length} tool relations`);

  // ============================================================
  // 5. Create Tasks
  // ============================================================
  const tasks = await Promise.all([
    prisma.task.create({ data: { title: 'Write a Blog Post', slug: 'write-blog-post', description: 'Create an SEO-optimized blog post from idea to publication', difficulty: 'easy', category: 'content', output: 'Published blog post with images', toolCount: 3, icon: '📝', featured: true, sortOrder: 1 } }),
    prisma.task.create({ data: { title: 'Create Social Media Content', slug: 'create-social-media', description: 'Generate a week of social media posts across platforms', difficulty: 'easy', category: 'content', output: '7 social media posts with images and captions', toolCount: 3, icon: '📱', featured: true, sortOrder: 2 } }),
    prisma.task.create({ data: { title: 'Build a Landing Page', slug: 'build-landing-page', description: 'Design and build a high-converting landing page', difficulty: 'medium', category: 'business', output: 'Live landing page with copy and design', toolCount: 4, icon: '🏗️', featured: true, sortOrder: 3 } }),
    prisma.task.create({ data: { title: 'Make a Product Demo Video', slug: 'product-demo-video', description: 'Create a professional product demo video with voiceover', difficulty: 'medium', category: 'design', output: '2-minute product demo video', toolCount: 4, icon: '🎬', featured: true, sortOrder: 4 } }),
    prisma.task.create({ data: { title: 'Automate Lead Generation', slug: 'automate-leads', description: 'Build an automated lead capture and enrichment workflow', difficulty: 'hard', category: 'automation', output: 'Automated lead pipeline', toolCount: 5, icon: '🤖', featured: false, sortOrder: 5 } }),
    prisma.task.create({ data: { title: 'Analyze Customer Feedback', slug: 'analyze-feedback', description: 'Process and analyze customer reviews to extract insights', difficulty: 'medium', category: 'business', output: 'Sentiment analysis report with charts', toolCount: 3, icon: '📊', featured: false, sortOrder: 6 } }),
    prisma.task.create({ data: { title: 'Design a Brand Kit', slug: 'design-brand-kit', description: 'Create a complete brand identity with logo, colors, and typography', difficulty: 'medium', category: 'design', output: 'Brand kit with logo, palette, fonts', toolCount: 4, icon: '🎨', featured: false, sortOrder: 7 } }),
    prisma.task.create({ data: { title: 'Write an Email Newsletter', slug: 'email-newsletter', description: 'Draft, design, and schedule an engaging email newsletter', difficulty: 'easy', category: 'marketing', output: 'Designed newsletter ready to send', toolCount: 2, icon: '✉️', featured: false, sortOrder: 8 } }),
    prisma.task.create({ data: { title: 'Generate AI Podcast', slug: 'ai-podcast', description: 'Create an AI-narrated podcast episode from a script or topic', difficulty: 'medium', category: 'content', output: '15-minute audio podcast episode', toolCount: 3, icon: '🎙️', featured: false, sortOrder: 9 } }),
    prisma.task.create({ data: { title: 'Build a Chatbot', slug: 'build-chatbot', description: 'Create and deploy a customer support chatbot for your website', difficulty: 'hard', category: 'coding', output: 'Deployed chatbot with knowledge base', toolCount: 4, icon: '💬', featured: false, sortOrder: 10 } }),
    prisma.task.create({ data: { title: 'SEO Content Strategy', slug: 'seo-strategy', description: 'Research keywords and create a content strategy with topic clusters', difficulty: 'medium', category: 'marketing', output: 'Content calendar with keyword map', toolCount: 3, icon: '🔍', featured: false, sortOrder: 11 } }),
    prisma.task.create({ data: { title: 'Create Marketing Ad Creatives', slug: 'marketing-creatives', description: 'Design ad creatives for multiple platforms with copy variations', difficulty: 'easy', category: 'marketing', output: 'Ad creatives for FB/IG/Google', toolCount: 3, icon: '📢', featured: false, sortOrder: 12 } }),
  ]);
  console.log(`✅ Created ${tasks.length} tasks`);

  // ============================================================
  // 6. Create Users
  // ============================================================
  const passwordHash = await bcrypt.hash('123456', 10);
  await prisma.user.create({
    data: { email: 'admin@aistackhub.com', passwordHash, name: 'Admin', role: 'admin' },
  });
  await prisma.user.create({
    data: { email: 'demo@aistackhub.com', passwordHash, name: 'Demo User', role: 'user' },
  });
  console.log('✅ Created 2 users (admin@aistackhub.com / demo@aistackhub.com, password: 123456)');

  // ============================================================
  // 7. Create Workflows
  // ============================================================
  const writeBlogWf = await prisma.workflow.create({
    data: {
      name: 'Blog Post Creation Pipeline',
      slug: 'blog-post-pipeline',
      description: 'End-to-end blog post creation from idea to published article',
      taskId: tasks[0].id,
      nodes: [
        { id: 'in1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Blog Topic & Keywords' } },
        { id: 't1', type: 'tool', position: { x: 100, y: 200 }, data: { label: 'Perplexity AI', toolSlug: 'perplexity' } },
        { id: 't2', type: 'tool', position: { x: 100, y: 350 }, data: { label: 'ChatGPT', toolSlug: 'chatgpt' } },
        { id: 't3', type: 'tool', position: { x: 100, y: 500 }, data: { label: 'Canva AI', toolSlug: 'canva-ai' } },
        { id: 'out1', type: 'output', position: { x: 100, y: 650 }, data: { label: 'Published Blog Post' } },
      ],
      edges: [
        { source: 'in1', target: 't1' },
        { source: 't1', target: 't2' },
        { source: 't2', target: 't3' },
        { source: 't3', target: 'out1' },
      ],
      estimatedCost: 50.00,
      estimatedTime: 120,
      timeSavedPct: 65,
      isTemplate: true,
      isPublic: true,
      featured: true,
      sortOrder: 1,
      createdBy: null,
      tools: {
        create: [
          { toolId: toolMap.get('perplexity')!, order: 0 },
          { toolId: toolMap.get('chatgpt')!, order: 1 },
          { toolId: toolMap.get('canva-ai')!, order: 2 },
        ],
      },
    },
  });

  const landingPageWf = await prisma.workflow.create({
    data: {
      name: 'Landing Page Creator',
      slug: 'landing-page-creator',
      description: 'Build a high-converting landing page with AI copy and design',
      taskId: tasks[2].id,
      nodes: [
        { id: 'in1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Product Brief' } },
        { id: 't1', type: 'tool', position: { x: 100, y: 200 }, data: { label: 'ChatGPT', toolSlug: 'chatgpt' } },
        { id: 't2', type: 'tool', position: { x: 100, y: 350 }, data: { label: 'Cursor', toolSlug: 'cursor' } },
        { id: 't3', type: 'tool', position: { x: 100, y: 500 }, data: { label: 'Canva AI', toolSlug: 'canva-ai' } },
        { id: 'out1', type: 'output', position: { x: 100, y: 650 }, data: { label: 'Live Landing Page' } },
      ],
      edges: [
        { source: 'in1', target: 't1' },
        { source: 't1', target: 't2' },
        { source: 't2', target: 't3' },
        { source: 't3', target: 'out1' },
      ],
      estimatedCost: 50.00,
      estimatedTime: 180,
      timeSavedPct: 70,
      isTemplate: true,
      isPublic: true,
      featured: true,
      sortOrder: 2,
      createdBy: null,
      tools: {
        create: [
          { toolId: toolMap.get('chatgpt')!, order: 0 },
          { toolId: toolMap.get('cursor')!, order: 1 },
          { toolId: toolMap.get('canva-ai')!, order: 2 },
        ],
      },
    },
  });

  const socialMediaWf = await prisma.workflow.create({
    data: {
      name: 'Social Media Content Factory',
      slug: 'social-media-factory',
      description: 'Generate a week of social media content in minutes',
      taskId: tasks[1].id,
      nodes: [
        { id: 'in1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Content Themes' } },
        { id: 't1', type: 'tool', position: { x: 100, y: 200 }, data: { label: 'Jasper AI', toolSlug: 'jasper' } },
        { id: 't2', type: 'tool', position: { x: 100, y: 350 }, data: { label: 'Canva AI', toolSlug: 'canva-ai' } },
        { id: 't3', type: 'tool', position: { x: 100, y: 500 }, data: { label: 'Grammarly', toolSlug: 'grammarly' } },
        { id: 'out1', type: 'output', position: { x: 100, y: 650 }, data: { label: '7 Posts Ready' } },
      ],
      edges: [
        { source: 'in1', target: 't1' },
        { source: 't1', target: 't2' },
        { source: 't2', target: 't3' },
        { source: 't3', target: 'out1' },
      ],
      estimatedCost: 62.00,
      estimatedTime: 60,
      timeSavedPct: 80,
      isTemplate: true,
      isPublic: true,
      featured: true,
      sortOrder: 3,
      createdBy: null,
      tools: {
        create: [
          { toolId: toolMap.get('jasper')!, order: 0 },
          { toolId: toolMap.get('canva-ai')!, order: 1 },
          { toolId: toolMap.get('grammarly')!, order: 2 },
        ],
      },
    },
  });

  const leadGenWf = await prisma.workflow.create({
    data: {
      name: 'Automated Lead Generation Pipeline',
      slug: 'lead-gen-pipeline',
      description: 'Capture and enrich leads automatically from multiple sources',
      taskId: tasks[4].id,
      nodes: [
        { id: 'in1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Lead Sources' } },
        { id: 't1', type: 'tool', position: { x: 100, y: 200 }, data: { label: 'Zapier AI', toolSlug: 'zapier-ai' } },
        { id: 't2', type: 'tool', position: { x: 100, y: 350 }, data: { label: 'Bardeen', toolSlug: 'bardeen' } },
        { id: 't3', type: 'tool', position: { x: 100, y: 500 }, data: { label: 'ChatGPT', toolSlug: 'chatgpt' } },
        { id: 'out1', type: 'output', position: { x: 100, y: 650 }, data: { label: 'Enriched Leads' } },
      ],
      edges: [
        { source: 'in1', target: 't1' },
        { source: 'in1', target: 't2' },
        { source: 't1', target: 't3' },
        { source: 't2', target: 't3' },
        { source: 't3', target: 'out1' },
      ],
      estimatedCost: 55.00,
      estimatedTime: 90,
      timeSavedPct: 85,
      isTemplate: true,
      isPublic: true,
      featured: false,
      sortOrder: 4,
      createdBy: null,
      tools: {
        create: [
          { toolId: toolMap.get('zapier-ai')!, order: 0 },
          { toolId: toolMap.get('bardeen')!, order: 1 },
          { toolId: toolMap.get('chatgpt')!, order: 2 },
        ],
      },
    },
  });

  const demoVideoWf = await prisma.workflow.create({
    data: {
      name: 'Product Demo Video Creator',
      slug: 'demo-video-creator',
      description: 'Create professional product demo videos with AI voiceover',
      taskId: tasks[3].id,
      nodes: [
        { id: 'in1', type: 'input', position: { x: 100, y: 50 }, data: { label: 'Product Features' } },
        { id: 't1', type: 'tool', position: { x: 100, y: 200 }, data: { label: 'ChatGPT', toolSlug: 'chatgpt' } },
        { id: 't2', type: 'tool', position: { x: 100, y: 350 }, data: { label: 'Descript', toolSlug: 'descript' } },
        { id: 't3', type: 'tool', position: { x: 100, y: 500 }, data: { label: 'ElevenLabs', toolSlug: 'elevenlabs' } },
        { id: 'out1', type: 'output', position: { x: 100, y: 650 }, data: { label: 'Demo Video' } },
      ],
      edges: [
        { source: 'in1', target: 't1' },
        { source: 't1', target: 't2' },
        { source: 't2', target: 't3' },
        { source: 't3', target: 'out1' },
      ],
      estimatedCost: 48.00,
      estimatedTime: 150,
      timeSavedPct: 75,
      isTemplate: true,
      isPublic: true,
      featured: false,
      sortOrder: 5,
      createdBy: null,
      tools: {
        create: [
          { toolId: toolMap.get('chatgpt')!, order: 0 },
          { toolId: toolMap.get('descript')!, order: 1 },
          { toolId: toolMap.get('elevenlabs')!, order: 2 },
        ],
      },
    },
  });

  console.log(`✅ Created 5 workflows`);

  // ============================================================
  // 8. Create Articles
  // ============================================================
  await prisma.article.create({
    data: {
      title: 'ChatGPT vs Claude vs Perplexity: Which AI Assistant is Right for You in 2025?',
      slug: 'chatgpt-vs-claude-vs-perplexity-2025',
      excerpt: 'A comprehensive comparison of the top AI chat assistants including ChatGPT, Claude, and Perplexity AI.',
      content: `## The Rise of AI Assistants

In 2025, choosing the right AI assistant has become as important as choosing the right computer. Each AI chat platform offers unique strengths that make it better suited for specific tasks.

## ChatGPT (OpenAI)

**Best for**: Creative writing, coding assistance, and general-purpose tasks.

ChatGPT remains the most versatile option. With GPT-4, it excels at creative writing, complex reasoning, and code generation. The plugin ecosystem and custom GPTs make it extensible for various use cases.

## Claude (Anthropic)

**Best for**: Long-form analysis, research papers, and nuanced reasoning.

Claude's 200K token context window means you can upload entire books or codebases for analysis. Its responses tend to be more thoughtful and well-structured, making it ideal for academic and professional writing.

## Perplexity AI

**Best for**: Research, fact-checking, and information gathering.

Perplexity combines LLM intelligence with real-time web search and citation. Every answer comes with sources, making it the go-to for researchers and journalists who need verifiable information.

## The Verdict

| Feature | ChatGPT | Claude | Perplexity |
|---------|---------|--------|------------|
| Creative Writing | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Coding | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ |
| Research | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Context Length | 128K | 200K | 32K |
| Price (Pro) | $20/mo | $20/mo | $20/mo |

**Winner depends on your use case.** For development, go with ChatGPT. For analysis, choose Claude. For research, Perplexity is unmatched.`,
      category: 'comparison',
      tags: ['chatgpt', 'claude', 'perplexity', 'ai assistant', 'comparison'],
      published: true,
      featured: true,
      publishedAt: new Date(),
      tools: {
        create: [
          { toolId: toolMap.get('chatgpt')! },
          { toolId: toolMap.get('claude')! },
          { toolId: toolMap.get('perplexity')! },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'How to Build an AI-Powered Content Pipeline in 2025',
      slug: 'ai-content-pipeline-2025',
      excerpt: 'Step-by-step guide to building an automated content creation workflow using AI tools.',
      content: `## Why Build an AI Content Pipeline?

Content creation is one of the most time-consuming marketing activities. An AI-powered content pipeline can reduce creation time by 60-80% while maintaining quality.

## Step 1: Research with Perplexity AI

Use Perplexity to research trending topics in your niche. Ask for:
- Current trending topics
- Common questions in your industry
- Competitor content gaps

## Step 2: Draft with ChatGPT

Feed your research into ChatGPT with a clear prompt template. Always include:
- Target audience
- Tone of voice
- Content structure
- Key points to cover

## Step 3: Edit with Grammarly

Run drafts through Grammarly for:
- Grammar and spelling
- Tone consistency
- Plagiarism check
- Readability score

## Step 4: Design Visuals with Canva AI

Generate featured images and infographics using Canva's AI tools. Maintain brand consistency with templates.

## Sample Workflow

\`\`\`
Research → Draft → Edit → Design → Publish
  (15min)  (30min)  (10min)  (15min)  (5min)
\`\`\`

Total time: ~75 minutes per high-quality article (vs 4-6 hours manually)`,
      category: 'workflow',
      tags: ['content', 'ai workflow', 'marketing', 'automation'],
      published: true,
      featured: true,
      publishedAt: new Date(),
      workflowId: writeBlogWf.id,
      tools: {
        create: [
          { toolId: toolMap.get('perplexity')! },
          { toolId: toolMap.get('chatgpt')! },
          { toolId: toolMap.get('grammarly')! },
          { toolId: toolMap.get('canva-ai')! },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Midjourney vs DALL·E 3 vs Stable Diffusion: The Ultimate AI Image Generator Guide',
      slug: 'ai-image-generators-ultimate-guide',
      excerpt: 'Compare the top AI image generators on quality, control, pricing, and use cases.',
      content: `## The AI Image Generation Revolution

AI image generators have transformed from novelty to necessity for designers, marketers, and creators. But which tool should you use?

## Midjourney — The Artist's Choice

Midjourney produces the most aesthetically pleasing images with minimal prompt engineering. Its latest version excels at photorealism and artistic styles.

**Pros**:
- Best image quality out of the box
- Strong artistic and creative outputs
- Active community for inspiration

**Cons**:
- Requires Discord (no native web UI)
- Less precise control over outputs
- No free tier

## DALL·E 3 — The Generalist

DALL·E 3 is integrated with ChatGPT, making it the easiest to use. Just describe what you want in natural language.

**Pros**:
- Best prompt understanding
- Excellent text rendering
- Integrated with ChatGPT

**Cons**:
- Less artistic control
- Content restrictions
- Higher cost

## Stable Diffusion — The Power User's Platform

Open-source and endlessly customizable with models, LoRAs, and ControlNet.

**Pros**:
- Maximum control
- Free and open-source
- Local deployment
- Huge model ecosystem

**Cons**:
- Steep learning curve
- Requires powerful hardware
- Inconsistent quality without fine-tuning`,
      category: 'comparison',
      tags: ['midjourney', 'dalle', 'stable diffusion', 'image generation', 'comparison'],
      published: true,
      featured: false,
      publishedAt: new Date(),
      tools: {
        create: [
          { toolId: toolMap.get('midjourney')! },
          { toolId: toolMap.get('dalle3')! },
          { toolId: toolMap.get('stable-diffusion')! },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: '10 AI Automation Tools That Will Save You 20+ Hours Per Week',
      slug: 'ai-automation-tools-2025',
      excerpt: 'Discover the best AI automation platforms and how to combine them for maximum productivity.',
      content: `## The Automation Opportunity

The average knowledge worker spends 60% of their time on repetitive tasks. AI automation tools can reclaim those hours.

## Top Automation Tools

### 1. Zapier AI
Connect 6000+ apps with natural language automations. Perfect for cross-platform workflows.

### 2. Make (Integromat)
Visual scenario builder with advanced branching and error handling. Better for complex automations.

### 3. Bardeen
Browser-based automation agent. Great for web scraping and data entry tasks.

### 4. Notion AI
Built-in AI for knowledge management, meeting notes, and project documentation.

## Power User Tips

1. **Chain tools together**: Use Bardeen for data collection → Zapier for processing → Notion for organization
2. **Start small**: Automate one workflow at a time
3. **Monitor and iterate**: Review automation performance weekly`,
      category: 'guide',
      tags: ['automation', 'productivity', 'zapier', 'make', 'workflow'],
      published: true,
      featured: false,
      publishedAt: new Date(),
      tools: {
        create: [
          { toolId: toolMap.get('zapier-ai')! },
          { toolId: toolMap.get('make')! },
          { toolId: toolMap.get('bardeen')! },
          { toolId: toolMap.get('notion-ai')! },
        ],
      },
    },
  });

  await prisma.article.create({
    data: {
      title: 'Cursor vs GitHub Copilot: Which AI Code Editor Wins in 2025?',
      slug: 'cursor-vs-copilot-2025',
      excerpt: 'An in-depth comparison of the two leading AI code editors.',
      content: `## The AI Coding Revolution

AI code assistants have fundamentally changed how developers work. Cursor and GitHub Copilot are the top contenders.

## GitHub Copilot

The established player with deep GitHub integration and VS Code support.

## Cursor

The newcomer with a fresh approach: AI-first editor with codebase context.

## Side-by-Side Comparison

| Feature | GitHub Copilot | Cursor |
|---------|---------------|--------|
| Code Completion | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Codebase Chat | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Inline Editing | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| IDE Support | VS Code, JetBrains | Custom (VS Code fork) |
| Price | $10/mo | $20/mo |

**Bottom line**: Copilot for existing workflows, Cursor for AI-native development.`,
      category: 'comparison',
      tags: ['cursor', 'github copilot', 'coding', 'comparison'],
      published: true,
      featured: false,
      publishedAt: new Date(),
      tools: {
        create: [
          { toolId: toolMap.get('github-copilot')! },
          { toolId: toolMap.get('cursor')! },
        ],
      },
    },
  });

  console.log('✅ Created 5 articles');

  // ============================================================
  // Summary
  // ============================================================
  console.log('\n🎉 Seed complete! Summary:');
  console.log(`   ${capabilities.length} capabilities`);
  console.log(`   ${toolsData.length} tools`);
  console.log(`   ${relationsData.length} tool relations`);
  console.log(`   ${tasks.length} tasks`);
  console.log(`   5 workflows`);
  console.log(`   2 users`);
  console.log(`   5 articles`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
