import type { EmblaCarouselType, EmblaOptionsType } from 'embla-carousel'
import AutoScroll from 'embla-carousel-auto-scroll'
import type { AutoScrollOptionsType } from 'embla-carousel-auto-scroll'
import Autoplay from 'embla-carousel-autoplay'
import type { AutoplayOptionsType } from 'embla-carousel-autoplay'
import Fade from 'embla-carousel-fade'
import type { FadeOptionsType } from 'embla-carousel-fade'
import useEmblaCarousel from 'embla-carousel-react'
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

type CarouselContextValue = {
  emblaRef: (node: HTMLElement | null) => void
  scrollSnaps: number[]
  selectedSnap: number
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  scrollTo: (index: number) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

export const useCarousel = () => {
  const context = useContext(CarouselContext)
  if (!context) {
    throw new Error('Carousel components must be used within <Carousel>')
  }

  return context
}

export const Carousel = ({
  options = {},
  autoplayOptions,
  autoScrollOptions,
  fadeOptions,
  onEmblaScroll,
  className,
  children,
  ...props
}: {
  options?: EmblaOptionsType
  autoplayOptions?: AutoplayOptionsType
  autoScrollOptions?: AutoScrollOptionsType
  fadeOptions?: FadeOptionsType
  onEmblaScroll?: (emblaApi: EmblaCarouselType) => void
  className?: string
  children: React.ReactNode
} & Omit<React.ComponentPropsWithoutRef<'div'>, 'children'>) => {
  const plugins = useMemo(() => {
    const plugins = []
    if (autoplayOptions) plugins.push(Autoplay(autoplayOptions))
    if (autoScrollOptions) plugins.push(AutoScroll(autoScrollOptions))
    if (fadeOptions) plugins.push(Fade(fadeOptions))

    return plugins
  }, [autoplayOptions, autoScrollOptions, fadeOptions])
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      ...options,
    },
    plugins
  )
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [selectedSnap, setSelectedSnap] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return

    const syncSnaps = () => setScrollSnaps(emblaApi.scrollSnapList())
    const syncSelected = () => {
      setSelectedSnap(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    syncSnaps()
    syncSelected()
    emblaApi.on('reInit', syncSnaps)
    emblaApi.on('reInit', syncSelected)
    emblaApi.on('select', syncSelected)

    const handleScroll = () => onEmblaScroll?.(emblaApi)
    if (onEmblaScroll) {
      handleScroll()
      emblaApi.on('scroll', handleScroll)
    }

    return () => {
      emblaApi.off('reInit', syncSnaps)
      emblaApi.off('reInit', syncSelected)
      emblaApi.off('select', syncSelected)
      emblaApi.off('scroll', handleScroll)
    }
  }, [emblaApi, onEmblaScroll])

  const value = useMemo(
    () => ({
      emblaRef,
      scrollSnaps,
      selectedSnap,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      scrollTo,
    }),
    [
      emblaRef,
      scrollSnaps,
      selectedSnap,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      scrollTo,
    ]
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        role="group"
        aria-roledescription="カルーセル"
        className={twMerge(
          'embla w-full',
          '[--slide-size:100%] [--slide-spacing:0]',
          className
        )}
        {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  )
}

export const CarouselTrack = ({
  className,
  containerClassName,
  children,
}: {
  className?: string
  containerClassName?: string
  children: React.ReactNode
}) => {
  const { emblaRef } = useCarousel()

  return (
    <div
      className={twMerge(
        'embla__viewport mx-auto h-full w-full min-w-0 overflow-hidden',
        className
      )}
      ref={emblaRef}>
      <div
        className={twMerge(
          'embla__container -ml-(--slide-spacing) flex h-full touch-pan-y touch-pinch-zoom',
          containerClassName
        )}>
        {React.Children.map(children, (child, index) =>
          React.isValidElement<{ index?: number }>(child)
            ? React.cloneElement(child, { index })
            : child
        )}
      </div>
    </div>
  )
}

export const CarouselSlide = ({
  className,
  children,
  index = 0,
}: {
  className?: string
  children: React.ReactNode
  index?: number
}) => {
  const { selectedSnap, scrollSnaps } = useCarousel()
  const total = scrollSnaps.length

  return (
    <div
      role="group"
      aria-roledescription="スライド"
      aria-label={total ? `${index + 1} / ${total}` : undefined}
      aria-current={selectedSnap === index}
      className={twMerge(
        'embla__slide min-w-0 shrink-0 grow-0 basis-(--slide-size) pl-(--slide-spacing)',
        className
      )}>
      {children}
    </div>
  )
}

const CarouselPrevIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    <path
      d="M20.1664 28.1334L8.93307 16.9334C8.79974 16.8 8.70552 16.6556 8.65041 16.5C8.59441 16.3445 8.56641 16.1778 8.56641 16C8.56641 15.8223 8.59441 15.6556 8.65041 15.5C8.70552 15.3445 8.79974 15.2 8.93307 15.0667L20.1664 3.83337C20.4775 3.52225 20.8664 3.3667 21.3331 3.3667C21.7997 3.3667 22.1997 3.53337 22.5331 3.8667C22.8664 4.20003 23.0331 4.58892 23.0331 5.03337C23.0331 5.47781 22.8664 5.8667 22.5331 6.20003L12.7331 16L22.5331 25.8C22.8442 26.1111 22.9997 26.4943 22.9997 26.9494C22.9997 27.4054 22.8331 27.8 22.4997 28.1334C22.1664 28.4667 21.7775 28.6334 21.3331 28.6334C20.8886 28.6334 20.4997 28.4667 20.1664 28.1334Z"
      fill="currentColor"
    />
  </svg>
)

const CarouselNextIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true">
    <path
      d="M11.4312 3.86663L22.6646 15.0666C22.7979 15.2 22.8921 15.3444 22.9473 15.5C23.0033 15.6555 23.0312 15.8222 23.0312 16C23.0312 16.1777 23.0033 16.3444 22.9473 16.5C22.8921 16.6555 22.7979 16.8 22.6646 16.9333L11.4312 28.1666C11.1201 28.4777 10.7312 28.6333 10.2646 28.6333C9.79792 28.6333 9.39792 28.4666 9.06458 28.1333C8.73125 27.8 8.56458 27.4111 8.56458 26.9666C8.56458 26.5222 8.73125 26.1333 9.06458 25.8L18.8646 16L9.06458 6.19997C8.75347 5.88885 8.59792 5.50574 8.59792 5.05063C8.59792 4.59463 8.76458 4.19997 9.09792 3.86663C9.43125 3.5333 9.82014 3.36663 10.2646 3.36663C10.709 3.36663 11.0979 3.5333 11.4312 3.86663Z"
      fill="currentColor"
    />
  </svg>
)

export const CarouselPrev = ({
  className,
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<'button'>) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      type="button"
      className={twMerge('embla__prev cursor-pointer', className)}
      aria-label="前へ"
      onClick={scrollPrev}
      disabled={disabled ?? !canScrollPrev}
      {...props}>
      {children ?? <CarouselPrevIcon />}
    </button>
  )
}

export const CarouselNext = ({
  className,
  children,
  disabled,
  ...props
}: React.ComponentPropsWithoutRef<'button'>) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      type="button"
      className={twMerge('embla__next cursor-pointer', className)}
      aria-label="次へ"
      onClick={scrollNext}
      disabled={disabled ?? !canScrollNext}
      {...props}>
      {children ?? <CarouselNextIcon />}
    </button>
  )
}

export const CarouselDots = ({
  className,
  dotClassName,
}: {
  className?: string
  dotClassName?: string
}) => {
  const { scrollSnaps, selectedSnap, scrollTo } = useCarousel()

  return (
    <div
      role="group"
      aria-label="スライドを選択"
      className={twMerge('embla__dots flex gap-2', className)}>
      {scrollSnaps.map((_, index) => (
        <button
          key={index}
          type="button"
          className={twMerge('embla__dot', dotClassName)}
          aria-label={`スライド${index + 1} / ${scrollSnaps.length}`}
          aria-current={selectedSnap === index}
          onClick={() => scrollTo(index)}></button>
      ))}
    </div>
  )
}
