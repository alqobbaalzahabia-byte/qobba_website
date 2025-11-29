import { createClient } from '@/lib/supabase-server'

export default async function BlogPostPage({params}) {
    const supabase = await createClient();
    const { data: clients } = await supabase.from('clients').select('*')
    console.log(clients)
    const { slug } = await params;
    return (
      <main>
        <h1>Blog Post</h1>
        <p>{slug}</p>
      </main>
    );
  }