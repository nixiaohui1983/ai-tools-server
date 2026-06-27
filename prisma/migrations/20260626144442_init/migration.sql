-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_tools" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_workflows" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logo" TEXT,
    "website" TEXT,
    "pricing" TEXT,
    "price" DECIMAL(10,2),
    "rating" DECIMAL(2,1),
    "categories" TEXT[],
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_capabilities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_capabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tool_relations" (
    "id" TEXT NOT NULL,
    "source_tool_id" TEXT NOT NULL,
    "target_tool_id" TEXT NOT NULL,
    "relationType" TEXT NOT NULL,
    "strength" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tool_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "difficulty" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL,
    "output" TEXT,
    "tool_count" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "task_id" TEXT,
    "nodes" JSONB NOT NULL,
    "edges" JSONB NOT NULL,
    "estimated_cost" DECIMAL(10,2),
    "estimatedTime" INTEGER,
    "time_saved_pct" INTEGER,
    "is_template" BOOLEAN NOT NULL DEFAULT false,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_tools" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "workflow_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "workflow_id" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "published_at" TIMESTAMP(3),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tools" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "tool_id" TEXT NOT NULL,

    CONSTRAINT "article_tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ToolToToolCapability" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ToolToToolCapability_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "saved_tools_user_id_tool_id_key" ON "saved_tools"("user_id", "tool_id");

-- CreateIndex
CREATE UNIQUE INDEX "saved_workflows_user_id_workflow_id_key" ON "saved_workflows"("user_id", "workflow_id");

-- CreateIndex
CREATE UNIQUE INDEX "tools_name_key" ON "tools"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tools_slug_key" ON "tools"("slug");

-- CreateIndex
CREATE INDEX "tools_categories_idx" ON "tools"("categories");

-- CreateIndex
CREATE INDEX "tools_featured_idx" ON "tools"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "tool_capabilities_name_key" ON "tool_capabilities"("name");

-- CreateIndex
CREATE INDEX "tool_relations_source_tool_id_idx" ON "tool_relations"("source_tool_id");

-- CreateIndex
CREATE INDEX "tool_relations_target_tool_id_idx" ON "tool_relations"("target_tool_id");

-- CreateIndex
CREATE UNIQUE INDEX "tool_relations_source_tool_id_target_tool_id_relationType_key" ON "tool_relations"("source_tool_id", "target_tool_id", "relationType");

-- CreateIndex
CREATE UNIQUE INDEX "tasks_slug_key" ON "tasks"("slug");

-- CreateIndex
CREATE INDEX "tasks_category_idx" ON "tasks"("category");

-- CreateIndex
CREATE INDEX "tasks_featured_idx" ON "tasks"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "workflows_slug_key" ON "workflows"("slug");

-- CreateIndex
CREATE INDEX "workflows_is_public_idx" ON "workflows"("is_public");

-- CreateIndex
CREATE INDEX "workflows_featured_idx" ON "workflows"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "workflow_tools_workflow_id_tool_id_key" ON "workflow_tools"("workflow_id", "tool_id");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "articles"("category");

-- CreateIndex
CREATE INDEX "articles_published_idx" ON "articles"("published");

-- CreateIndex
CREATE INDEX "articles_featured_idx" ON "articles"("featured");

-- CreateIndex
CREATE UNIQUE INDEX "article_tools_article_id_tool_id_key" ON "article_tools"("article_id", "tool_id");

-- CreateIndex
CREATE INDEX "_ToolToToolCapability_B_index" ON "_ToolToToolCapability"("B");

-- AddForeignKey
ALTER TABLE "saved_tools" ADD CONSTRAINT "saved_tools_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_tools" ADD CONSTRAINT "saved_tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_workflows" ADD CONSTRAINT "saved_workflows_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_workflows" ADD CONSTRAINT "saved_workflows_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_relations" ADD CONSTRAINT "tool_relations_source_tool_id_fkey" FOREIGN KEY ("source_tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tool_relations" ADD CONSTRAINT "tool_relations_target_tool_id_fkey" FOREIGN KEY ("target_tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tools" ADD CONSTRAINT "workflow_tools_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_tools" ADD CONSTRAINT "workflow_tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tools" ADD CONSTRAINT "article_tools_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tools" ADD CONSTRAINT "article_tools_tool_id_fkey" FOREIGN KEY ("tool_id") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToolToToolCapability" ADD CONSTRAINT "_ToolToToolCapability_A_fkey" FOREIGN KEY ("A") REFERENCES "tools"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ToolToToolCapability" ADD CONSTRAINT "_ToolToToolCapability_B_fkey" FOREIGN KEY ("B") REFERENCES "tool_capabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
