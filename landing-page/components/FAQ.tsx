interface FAQ {
  id: number;
  question: string;
  answer: string;
  href?: string;
};

export default function FAQ({ faqs }: { faqs: FAQ[] }) {
  return (
    <div className='mt-30 mx-auto max-w-2xl divide-y divide-gray-900/10 dark:divide-gray-200/10 px-6 pb-8 sm:pb-1 sm:pt-12 lg:max-w-7xl lg:px-8 lg:py-1'>
      <h2 className='text-2xl font-bold leading-10 tracking-tight text-gray-900 dark:text-white'>
        Frequently asked questions
      </h2>
      <dl className='mt-10 space-y-8 divide-y divide-gray-900/10'>
        {faqs.map((faq) => (
          <div key={faq.id} className='pt-12 lg:grid lg:grid-cols-12 lg:gap-8'>
            <dt className='text-base font-semibold leading-7 text-gray-900 lg:col-span-5 dark:text-white'>
              {faq.question}
            </dt>
            <dd className='flex items-center justify-start gap-2 mt-4 lg:col-span-7 lg:mt-0'>
              <p className='text-base leading-7 text-gray-600 dark:text-white'>{faq.answer}</p>
              {faq.href && (
                <a href={faq.href} className='text-base leading-7 text-green-600 hover:text-green-400'>
                  Learn more →
                </a>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
