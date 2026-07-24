import type { EmblaCarouselType } from 'embla-carousel'
import { useCallback, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import {
  Carousel,
  CarouselSlide,
  CarouselTrack,
  useCarousel,
} from '@/components/Carousel'
import bananaIcecream from '@/images/icecream/banana-icecream.png'
import bananaIngredient from '@/images/icecream/banana-ingredient.png'
import blueberryIcecream from '@/images/icecream/blueberry-icecream.png'
import blueberryIngredient from '@/images/icecream/blueberry-ingredient.png'
import chocomintIcecream from '@/images/icecream/chocomint-icecream.png'
import chocomintIngredient from '@/images/icecream/chocomint-ingredient.png'
import table from '@/images/icecream/table.svg'

const icecreams = [
  {
    image: blueberryIcecream,
    ingredient: blueberryIngredient,
    title: 'Honey Blueberry Lavender',
    caption:
      'Enjoy a harmonious blend of honey, juicy blueberries, and a gentle touch of lavender and berries. This easy-going and indulgent flavor is as delightful as it is unique.',
    color: '#60A4B4',
  },
  {
    image: bananaIcecream,
    ingredient: bananaIngredient,
    title: 'Banana Chocolate Date',
    caption:
      "Discover the delicious twist on Palm Springs' iconic date shake. Made with Regenerative Organic Certified® bananas, sweet dates, and rich dark chocolate chips, it’s a tropical treat you’ll love.",
    color: '#EBBF00',
  },
  {
    image: chocomintIcecream,
    ingredient: chocomintIngredient,
    title: 'Mint Chocolate Chip',
    caption:
      'Mint Chocolate ChipSavor the creamiest take on the timeless mint chocolate chip flavor. Made with natural ingredients, no artificial coloring or flavoring, and perfectly balanced chocolate chips.',
    color: '#689473',
  },
]

function IcecreamCarouselNav({ className }: { className?: string }) {
  const { selectedSnap, scrollTo } = useCarousel()

  // 選択中の次から、icecreams の順で循環表示
  const navIndices = Array.from(
    { length: icecreams.length - 1 },
    (_, i) => (selectedSnap + 1 + i) % icecreams.length
  )

  return (
    <div
      className={twMerge(
        'flex justify-end gap-x-[5.2cqi] px-[4.375cqi]',
        className
      )}>
      {navIndices.map((index) => {
        const { image, title } = icecreams[index]

        return (
          <button
            key={index}
            type="button"
            className="w-[12.7cqi] transition-transform hover:scale-105"
            aria-label={`${title}へ移動`}
            onClick={() => scrollTo(index)}>
            <img
              src={image.src}
              alt=""
              width={image.width / 2}
              height={image.height / 2}
              className="w-full"
            />
          </button>
        )
      })}
    </div>
  )
}

export default function IcecreamCarousel({
  className,
}: {
  className?: string
}) {
  const [color, setColor] = useState(icecreams[0].color)

  const handleScroll = useCallback((emblaApi: EmblaCarouselType) => {
    setColor(icecreams[emblaApi.selectedScrollSnap()].color)
  }, [])

  return (
    <Carousel
      fadeOptions={{}}
      onEmblaScroll={handleScroll}
      options={{
        align: 'center',
        containScroll: false,
      }}
      className={twMerge(
        'relative h-svh w-full',
        'bg-(--color) transition-colors duration-300',
        className
      )}
      style={{ '--color': color } as React.CSSProperties}>
      <CarouselTrack className="@container col-span-full col-start-1 row-start-1 max-w-[1920px]">
        {icecreams.map(
          ({ image, ingredient, title, caption, color }, index) => (
            <CarouselSlide
              key={index}
              className="group overflow-y-clip px-[2cqi]">
              <div
                className="relative grid h-full w-full grid-cols-[2fr_6fr_2fr] grid-rows-[auto_1fr] place-items-end pt-(--header-height) landscape:grid-cols-[min(28.9cqi,555px)_min(3.3cqi,65px)_min(3.125cqi,60px)_min(25cqi,480px)_min(3.125cqi,60px)_min(3.3cqi,65px)_min(28.9cqi,555px)] landscape:grid-rows-1"
                data-color={color}>
                <img
                  src={table.src}
                  width={table.width}
                  height={table.height}
                  className="relative col-span-full col-start-1 -row-end-1 w-full translate-y-[46%] self-end landscape:col-start-2 landscape:-col-end-2"
                />
                <div className="relative col-start-2 -row-end-1 w-full landscape:col-start-3 landscape:-col-end-3">
                  <img
                    src={ingredient.src}
                    alt=""
                    width={ingredient.width / 2}
                    height={ingredient.height / 2}
                    className="absolute -inset-x-full top-[15%] mx-auto w-[calc(100%/3*5)] max-w-none origin-top scale-30 transition-transform duration-400 group-aria-current:translate-y-[-75%] group-aria-current:scale-100"
                  />
                  <img
                    src={image.src}
                    alt=""
                    width={image.width / 2}
                    height={image.height / 2}
                    className="relative w-full"
                  />
                </div>
                <div className="@container relative col-start-1 col-end-3 row-start-1 grid w-full gap-y-3 justify-self-stretch landscape:col-end-4 landscape:gap-y-5.5 landscape:py-12.5">
                  <p className="font-display text-[max(12cqi,1.5rem)] text-white">
                    {title}
                  </p>
                  <p className="text-[max(2.3cqi,1rem)] text-white">
                    {caption}
                  </p>
                  <a
                    href=""
                    className={twMerge(
                      'font-display max-w-[13.5em] rounded-[10px] bg-white p-5 text-center text-[4.7cqi] text-black uppercase',
                      'relative overflow-clip after:absolute after:inset-[-25%] after:m-auto after:block after:aspect-square after:h-auto after:w-[150%] after:rounded-full after:bg-white after:mix-blend-difference after:transition after:duration-400 not-hover:after:scale-0'
                    )}>
                    Shop now!
                  </a>
                </div>
              </div>
            </CarouselSlide>
          )
        )}
      </CarouselTrack>
      <div className="@container absolute inset-x-0 bottom-[6.35cqi] mx-auto w-full max-w-[1920px]">
        <IcecreamCarouselNav className="" />
      </div>
    </Carousel>
  )
}
