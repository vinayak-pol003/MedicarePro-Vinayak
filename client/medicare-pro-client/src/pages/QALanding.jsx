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
    slidesToShow: 4,        // Shows 4 at a time on desktop
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
    <section className="bg-white py-12">
      <div className="px-4 md:px-12 w-full">
        <h4 className="text-lg font-semibold text-gray-700 text-center mb-8">
          What Our Patients Say
        </h4>
        <Slider {...settings}>
          {testimonials.map((item, idx) => (
            <div key={idx} className="px-3">
              <div className="bg-gray-50 p-6 rounded-xl shadow text-center h-full flex flex-col justify-center">
                <p className="text-gray-600 mb-4">"{item.text}"</p>
                <div className="font-semibold text-blue-700">{item.name}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}
