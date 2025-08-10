import { Button } from '@/components/ui/button';
import { Leaf, Heart, Shield, Award, Users, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: Leaf,
      title: "Natural & Pure",
      description: "We use only the finest natural ingredients sourced directly from trusted farms."
    },
    {
      icon: Heart,
      title: "Made with Care",
      description: "Every bottle is crafted with love and attention to detail for the best results."
    },
    {
      icon: Shield,
      title: "Quality Assured",
      description: "Our products undergo rigorous testing to ensure safety and effectiveness."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in natural hair care solutions."
    }
  ];

  const team = [
    {
      name: "Dr. Priya Sharma",
      role: "Chief Formulator",
      description: "20+ years in Ayurvedic medicine"
    },
    {
      name: "Rajesh Kumar",
      role: "Quality Control Head",
      description: "Expert in herbal product testing"
    },
    {
      name: "Meera Patel",
      role: "Research Director",
      description: "PhD in Natural Product Chemistry"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-green-600">Sasya Mantra</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Committed to bringing you the finest natural hair care solutions through the wisdom of Ayurveda and modern science.
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
                  Sasya Mantra was born from a deep respect for traditional Ayurvedic wisdom and a passion for natural healing. Our founder, inspired by ancient Sanskrit texts and family recipes, embarked on a journey to create hair care solutions that truly work.
                </p>
                <p>
                  "Sasya" means herbs in Sanskrit, and "Mantra" represents the sacred knowledge passed down through generations. Together, they embody our mission to harness the power of natural herbs through time-tested formulations.
                </p>
                <p>
                  Today, we continue to honor this legacy by combining traditional wisdom with modern research, ensuring that every product meets the highest standards of quality and effectiveness.
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
                      <p className="text-sm text-gray-600">Natural Herbs</p>
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
              The principles that guide everything we do
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Expert Team</h2>
            <p className="text-lg text-gray-600">
              Meet the passionate professionals behind Sasya Mantra
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Hair?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join thousands of satisfied customers who trust Sasya Mantra for their hair care needs.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Order Now
          </Button>
        </div>
      </section>
    </div>
  );
}