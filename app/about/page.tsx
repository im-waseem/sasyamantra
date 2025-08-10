import { Button } from '@/components/ui/button';
import { Leaf, Heart, Shield, Award, Users } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: "Natural & Pure",
      description: "Only the finest natural ingredients, carefully sourced from trusted farms to ensure purity."
    },
    {
      icon: Heart,
      title: "Crafted with Care",
      description: "Each product is lovingly formulated with meticulous attention to detail for optimal results."
    },
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "All products undergo stringent testing to guarantee safety, efficacy, and consistency."
    },
    {
      icon: Award,
      title: "Recognized Excellence",
      description: "Award-winning herbal hair care solutions trusted by thousands worldwide."
    }
  ];

  const team = [
    {
      name: "Sulaiman",
      role: "Head Herbalist",
      description: "Dedicated expert in herbal formulations and natural healing."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* About Us Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
            About <span className="text-green-600">Sasya Mantra</span> 🌿
          </h1>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Sasya Mantra is more than a brand — it’s a story of heritage, care, and the timeless power of nature.
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            The name comes from two Sanskrit words:
          </p>
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            <strong className="text-green-600">Sasya</strong> – meaning plants, herbs, and natural growth
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            <strong className="text-green-600">Mantra</strong> – meaning a sacred chant, formula, or powerful message
          </p>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            Together, Sasya Mantra means “the sacred formula of nature”, representing our mission to bring authentic herbal purity into modern life.
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            While we began with herbal hair care, our vision reaches further — to offer a complete range of herbal and wellness products that help you live a healthier, more natural life.
          </p>
          <h2 className="text-2xl font-semibold text-green-600 mb-4">Our Promise</h2>
          <p className="text-lg text-gray-700 max-w-xl mx-auto leading-relaxed">
            We are committed to creating pure, safe, and effective herbal products that respect nature and care for you. Every product is made with honesty, authentic ingredients, and a vision for a healthier tomorrow — without compromise.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Sasya Mantra emerged from a deep-rooted respect for Ayurveda and a desire to harness nature’s healing powers. Inspired by ancient Sanskrit wisdom and traditional family recipes, our founder set out to create truly effective herbal hair care.
                </p>
                <p>
                  The name “Sasya” means plants and herbs, while “Mantra” signifies a sacred formula or chant — together symbolizing our commitment to delivering nature’s sacred formula for wellness.
                </p>
                <p>
                  Today, we continue this legacy by blending time-tested traditions with modern research, ensuring every product is safe, pure, and effective.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-80 h-96 bg-gradient-to-b from-green-100 to-green-50 rounded-3xl shadow-xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Leaf className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Established</h3>
                    <p className="text-3xl font-bold text-green-600">2019</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">10K+</p>
                      <p className="text-sm text-gray-600">Happy Customers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">15+</p>
                      <p className="text-sm text-gray-600">Herbal Ingredients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">
              These core principles guide everything we do at Sasya Mantra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Expert Team</h2>
            <p className="text-lg text-gray-600">
              Passionate professionals dedicated to crafting the best herbal products
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-md mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Hair?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of happy customers who trust Sasya Mantra for natural, effective hair care.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Order Now
          </Button>
        </div>
      </section>
    </div>
  );
}
