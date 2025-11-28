'use server'

import { createServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'

export async function insertService(formData) {
  const supabase = createServerClient()
  
  const image = formData.get('image')
  const titleAr = formData.get('titleAr')
  const titleEn = formData.get('titleEn')
  const descriptionAr = formData.get('descriptionAr')
  const descriptionEn = formData.get('descriptionEn')

  const title = {
    ar: titleAr || 'التسويق الرقمي',
    en: titleEn || 'Digital Marketing'
  }

  const description = {
    ar: descriptionAr || 'هذا النص يمكن أن يتم تركيبه على أي تصميم دون مشكلة فلن يبدو وكأنه نص منسوخ',
    en: descriptionEn || 'This text can be applied to any design without any issue, and it won’t look like copied content.'
  }

  const { data, error } = await supabase
    .from('services')
    .insert([
      {
        image: "https://jmzlluecfhacxxnrmcds.supabase.co/storage/v1/object/sign/image/frame-4.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNDE2ODkxZi0yOGM5LTQ4ZDItODViYy02YTZiNzBiM2EwNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS9mcmFtZS00LnN2ZyIsImlhdCI6MTc2Mzc2NDU4MiwiZXhwIjoxNzk1MzAwNTgyfQ.UeXxLwrjjnfDbcjFB3TEuy59d7mgES54PKdioyvEbas",
        title,
        description
      }
    ])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/ar/contact', 'page')
  revalidatePath('/en/contact', 'page')
  return { success: true, data }
}

export async function insertProject(formData) {
  const supabase = createServerClient()
  
  const image = formData.get('image')
  const titleAr = formData.get('titleAr')
  const titleEn = formData.get('titleEn')
  const descriptionAr = formData.get('descriptionAr')
  const descriptionEn = formData.get('descriptionEn')

  const title = {
    ar: titleAr || 'التسويق الرقمي',
    en: titleEn || 'Digital Marketing'
  }

  const description = {
    ar: descriptionAr || 'هذا النص يمكن أن يتم تركيبه على أي تصميم دون مشكلة فلن يبدو وكأنه نص منسوخ',
    en: descriptionEn || 'This text can be applied to any design without any issue, and it won’t look like copied content.'
  }

  const { data, error } = await supabase
    .from('projects')
    .insert([
      {
        image: "https://jmzlluecfhacxxnrmcds.supabase.co/storage/v1/object/sign/image/frame-4.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNDE2ODkxZi0yOGM5LTQ4ZDItODViYy02YTZiNzBiM2EwNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS9mcmFtZS00LnN2ZyIsImlhdCI6MTc2Mzc2NDU4MiwiZXhwIjoxNzk1MzAwNTgyfQ.UeXxLwrjjnfDbcjFB3TEuy59d7mgES54PKdioyvEbas",
        title,
        description
      }
    ])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/ar/contact', 'page')
  revalidatePath('/en/contact', 'page')
  return { success: true, data }
}

export async function insertPlan(formData) {
  const supabase = createServerClient()
  
  const titleAr = formData.get('titleAr')
  const titleEn = formData.get('titleEn')
  const featuresAr = formData.get('featuresAr')
  const featuresEn = formData.get('featuresEn')
  const price = formData.get('price')
  const currencyAr = formData.get('currencyAr')
  const currencyEn = formData.get('currencyEn')
  const discount = formData.get('discount')
  const type = formData.get('type')

  const title = {
    ar: titleAr || 'الخطة الأساسية',
    en: titleEn || 'Basic Plan'
  }

  const currency = {
    ar: currencyAr || 'درهم',
    en: currencyEn || 'AED'
  }

  // convert features textarea (newline-separated) to array like [prop1,prop2,...]
  const parseFeatures = (featuresText) => {
    if (!featuresText) return []
    return featuresText
      .split(/\n/)
      .map(f => f.trim())
      .filter(f => f.length > 0)
  }

  const features = {
    ar: featuresAr ? parseFeatures(featuresAr) : ['ميزة 1', 'ميزة 2', 'ميزة 3'],
    en: featuresEn ? parseFeatures(featuresEn) : ['Feature 1', 'Feature 2', 'Feature 3']
  }

  const { data, error } = await supabase
    .from('plans')
    .insert([
      {
        title,
        features,
        price: parseFloat(price) || 99.99,
        currency,
        discount: parseFloat(discount) || 0,
        type: type || 'permuim'
      }
    ])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/ar/contact', 'page')
  revalidatePath('/en/contact', 'page')
  return { success: true, data }
}

export async function insertBlog(formData) {
  const supabase = createServerClient()
  
  const image = formData.get('image')
  const titleAr = formData.get('titleAr')
  const titleEn = formData.get('titleEn')
  const descriptionAr = formData.get('descriptionAr')
  const descriptionEn = formData.get('descriptionEn')

  const title = {
    ar: titleAr || 'كيف سيغير الذكاء الاصطناعي عالم ريادة الأعمال؟',
    en: titleEn || 'How will AI change the world of entrepreneurship?'
  }

  const description = {
    ar: descriptionAr || 'هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من',
    en: descriptionEn || 'This text is an example of text that can be replaced in the same space. This text has been generated from'
  }

  const { data, error } = await supabase
    .from('blogs')
    .insert([
      {
        image: image || "https://jmzlluecfhacxxnrmcds.supabase.co/storage/v1/object/sign/image/frame-4.svg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jNDE2ODkxZi0yOGM5LTQ4ZDItODViYy02YTZiNzBiM2EwNjYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZS9mcmFtZS00LnN2ZyIsImlhdCI6MTc2Mzc2NDU4MiwiZXhwIjoxNzk1MzAwNTgyfQ.UeXxLwrjjnfDbcjFB3TEuy59d7mgES54PKdioyvEbas",
        title,
        description
      }
    ])
    .select()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/ar/contact', 'page')
  revalidatePath('/en/contact', 'page')
  return { success: true, data }
}

