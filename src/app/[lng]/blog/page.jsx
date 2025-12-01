import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from '../../../components/ui/Button'
import { Card } from "../../../components/ui/Card";
import { createClient } from '@/lib/supabase-server'
import { HiOutlineArrowNarrowRight } from "react-icons/hi";

const paginationDots = [
  { active: false },
  { active: false },
  { active: false },
  { active: true },
];

export default async function BlogPage({ params }) {
  const { lng } = await params;
  const supabase = await createClient();

  const { data: blogsData, error } = await supabase.from('blogs').select('*')
    .order('created_at', { ascending: false });

  const featuredBlog = blogsData && blogsData.length > 0 ? blogsData[0] : null;
  const blogs = blogsData && blogsData.length > 0 ? blogsData.slice(1) : [];

  // Helper function to get localized text
  const getLocalizedText = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    return obj[lng] || obj.ar || obj.en || fallback;
  };

  if (error) {
    return (
      <div className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-xl">
            {lng === 'ar' ? 'حدث خطأ أثناء تحميل المدونة' : 'Error loading blog'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-[#fdfef9] overflow-hidden w-full min-h-screen relative"
      data-model-id="58:1871"
    >
      <main className="pt-[50px]">
        <div className="container mx-auto px-5 lg:max-w-[1150px]">
        <section className="relative animate-fade-in opacity-0 [--animation-delay:200ms]">
          {featuredBlog && (
            <>
              <div className="w-full px-6">
                <h1 className=" h-[60px]  font-bold text-[#172436] text-[32px] leading-[normal] tracking-[0] ">
                  {lng === 'ar' ? 'المدونة' : 'Blog'}
                </h1>
                <div className="content  flex flex-wrap md:flex-nowrap  md:gap-10  lg:gap-20">
                <div className="box-right">
                <div className="pb-8 gap-4">
                <p className="font-normal text-transparent text-[28px] tracking-[0] leading-7 ">
                  <span className="font-medium text-[#4b4b4b]">
                    {getLocalizedText(featuredBlog.title)}
                  </span>
                </p>
              </div>

                </div>
            
                <div className="box-left">
              <p className="md:w-[567px]  font-normal text-[#585858] text-xl leading-7 tracking-[0] ">
                {getLocalizedText(featuredBlog.description)}
              </p>

              <Button
                variant="ghost"
                className="h-auto flex items-center justify-end gap-2.5 rounded-lg hover:bg-transparent transition-colors group"
              >
                <FiChevronLeft className="w-7 h-7 text-[#f0a647] transition-transform" />
                <span className="cursor-pointer font-cairo-med-20  text-[#f0a647]">
                  {lng === 'ar' ? 'عرض المزيد' : 'Read More'}
                </span>
              </Button>
              </div>
            </div>
              </div>

              <div className="main-blog">
                <Image
                  width={1152}
                  height={508}
                  className="w-full md:h-[508px] rounded-lg object-cover"
                  alt={getLocalizedText(featuredBlog.title)}
                  src={featuredBlog.image}
                />
              </div>          

              <div className="w-[116px] h-4 flex gap-3 pt-3 px-2">
                {paginationDots.map((dot, index) => (
                  <div
                    key={index}
                    className={`${dot.active ? "w-8 bg-[#fecf85]" : "w-4 bg-[#d9d9d999]"} h-3 rounded-lg transition-all cursor-pointer hover:opacity-80`}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <section className="relative mt-[80px] translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]  sm:px-6 lg:px-8">
          <h2 className=" mb-8  font-bold text-[#172436] text-2xl sm:text-3xl lg:text-[40px] leading-[normal] tracking-[0] ">
            {lng === 'ar' ? 'المقالات الشائعة' : 'Popular Articles'}
          </h2>

          {blogs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6 max-w-7xl mx-auto">
              {blogs.map((blog, index) => (
                <Card
                  key={blog.id || index}
                  className="w-full h-auto bg-[#ffffff1f] rounded-xl border border-solid border-white shadow-cards overflow-hidden transition-transform hover:scale-105 cursor-pointer"
                >
                  <div className="p-0">
                    <Image
                      width={300}
                      height={246}
                      className="w-full h-[200px] sm:h-[220px] lg:h-[246px] rounded-[11px_12px_0px_0px] object-cover "
                      alt={getLocalizedText(blog.title)}
                      src={blog.image}
                    />
                    <div className="p-4">
                      <h3 className="min-h-[26px] flex items-center font-normal text-transparent text-sm leading-[normal] tracking-[0]  mb-2 ">
                        <span className="font-bold text-[#4b4b4b] line-clamp-1">
                          {getLocalizedText(blog.title)}
                        </span>
                      </h3>
                      <p className=" font-normal text-[#585858] text-sm leading-[normal] tracking-[0] line-clamp-3 ">
                        {getLocalizedText(blog.description)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#585858] text-lg">
                {lng === 'ar' ? 'لا توجد مقالات متاحة حالياً' : 'No articles available at the moment'}
              </p>
            </div>
          )}

          <div className="flex gap-4 mt-8">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer w-12 h-12 rounded-full bg-[#f0a647]  transition-colors"
            >
              <HiOutlineArrowNarrowRight className="w-6 h-6 text-white rotate-360" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer w-12 h-12 rounded-full bg-[#f0a647]  transition-colors"
            >
              <HiOutlineArrowNarrowRight className="w-6 h-6 text-white rotate-180" />
            </Button>
          </div>
        </section>
        </div>
      </main>

    </div>
  );
}