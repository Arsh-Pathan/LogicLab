-- ============================================================
-- LogicLab — Row Level Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ic_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circuit_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Circuits
CREATE POLICY "Public circuits are viewable by everyone"
  ON public.circuits FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own circuits"
  ON public.circuits FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own circuits"
  ON public.circuits FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own circuits"
  ON public.circuits FOR DELETE USING (auth.uid() = user_id);

-- IC Definitions
CREATE POLICY "Public ICs are viewable by everyone"
  ON public.ic_definitions FOR SELECT USING (is_public = true OR auth.uid() = user_id);

CREATE POLICY "Users can create own ICs"
  ON public.ic_definitions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ICs"
  ON public.ic_definitions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ICs"
  ON public.ic_definitions FOR DELETE USING (auth.uid() = user_id);

-- Circuit Versions
CREATE POLICY "Circuit versions follow parent circuit visibility"
  ON public.circuit_versions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.circuits c
    WHERE c.id = circuit_id AND (c.is_public = true OR c.user_id = auth.uid())
  ));

CREATE POLICY "Users can create versions for own circuits"
  ON public.circuit_versions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.circuits c
    WHERE c.id = circuit_id AND c.user_id = auth.uid()
  ));

-- Tags (read-only for users, admin-managed)
CREATE POLICY "Tags are viewable by everyone"
  ON public.tags FOR SELECT USING (true);

-- Community Posts
CREATE POLICY "Posts are viewable by everyone"
  ON public.community_posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

-- Post Tags
CREATE POLICY "Post tags are viewable by everyone"
  ON public.post_tags FOR SELECT USING (true);

CREATE POLICY "Post authors can manage post tags"
  ON public.post_tags FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.community_posts p
    WHERE p.id = post_id AND p.user_id = auth.uid()
  ));

-- Comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- Votes
CREATE POLICY "Votes are viewable by everyone"
  ON public.votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote"
  ON public.votes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can change own votes"
  ON public.votes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can remove own votes"
  ON public.votes FOR DELETE USING (auth.uid() = user_id);

-- Bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create bookmarks"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Lessons (read-only)
CREATE POLICY "Lessons are viewable by everyone"
  ON public.lessons FOR SELECT USING (true);

-- User Progress
CREATE POLICY "Users can view own progress"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can track own progress"
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);

-- Badges (read-only)
CREATE POLICY "Badges are viewable by everyone"
  ON public.badges FOR SELECT USING (true);

-- User Badges
CREATE POLICY "User badges are viewable by everyone"
  ON public.user_badges FOR SELECT USING (true);
