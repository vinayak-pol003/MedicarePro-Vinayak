import Slider from "react-slick";

const testimonials = [
  {
    text: "The doctors were so helpful and the whole appointment process was smooth. I felt heard and cared for.",
    name: "Priya S."
  },
  {
    text: "Quick, professional, and the staff explained everything clearly. Highly recommend for families!",
    name: "Rahul T."
  },
  {
    text: "Efficient claim process and affordable services. I trust them for my health needs.",
    name: "Anita M."
  },
  {
    text: "Excellent online appointment tools, and such caring nurses. Made everything seamless.",
    name: "Deepak K."
  },
  {
    text: "Very prompt service and knowledgeable doctors. The clinic is clean and comfortable.",
    name: "Farah Z."
  }
];

export default function LandingTestimonials() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="bg-white py-8 sm:py-12">
      <div className="px-2 sm:px-4 md:px-12 w-full">
        <h4 className="text-base sm:text-lg font-semibold text-gray-700 text-center mb-4 sm:mb-8">
          What Our Patients Say
        </h4>
        <Slider {...settings}>
          {testimonials.map((item, idx) => (
            <div key={idx} className="px-2 sm:px-3">
              <div className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow text-center h-full flex flex-col justify-center">
                <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-2 sm:mb-4 min-h-[64px] sm:min-h-[84px]">
                  "{item.text}"
                </p>
                <div className="font-semibold text-blue-700 text-sm sm:text-base">{item.name}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
