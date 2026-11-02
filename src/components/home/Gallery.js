const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=700&q=80",
    alt: "Volunteers distributing winter clothes from cardboard boxes",
    caption: "Winter Clothes Distribution",
    place: "Mirpur 10",
  },
  {
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=700&q=80",
    alt: "Group of volunteers cleaning a roadside with gloves and bags",
    caption: "Roadside Clean-up",
    place: "Dhanmondi",
  },
  {
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=700&q=80",
    alt: "Children reading books at a community learning session",
    caption: "Weekend Learning Circle",
    place: "Mohammadpur",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=700&q=80",
    alt: "Volunteers preparing hot meals in a community kitchen",
    caption: "Community Kitchen",
    place: "Old Dhaka",
  },
  {
    src: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=700&q=80",
    alt: "Friends planting saplings in a park",
    caption: "Plantation Day",
    place: "Bashundhara",
  },
  {
    src: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=700&q=80",
    alt: "Volunteers standing together after a donation drive",
    caption: "Blanket Drive",
    place: "Uttara",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="section bg-base-200/60">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="section-head">
          <span className="eyebrow">From the field</span>
          <h2 className="text-3xl font-semibold sm:text-4xl">Moments from our neighbourhoods</h2>
          <p className="text-base-content/70">
            A glimpse of the drives Shongkolpo volunteers have run across Dhaka
            this year.
          </p>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
          {PHOTOS.map((photo, index) => (
            <li
              key={photo.caption}
              className={`group relative overflow-hidden rounded-2xl ${index === 0 ? "col-span-2 lg:col-span-2" : ""}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- static gallery imagery */}
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className={`w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] ${
                  index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"
                }`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-sm font-semibold text-white">{photo.caption}</p>
                <p className="text-xs text-white/75">{photo.place}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
