import { Button } from '@/components/ui/button';
import { Leaf, Star, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Sasya Mantra
                  <br />
                  <span className="text-green-600">Herbal Hair</span>
                  <br />
                  Growth Oil
                </h1>
                <p className="text-lg text-gray-600 max-w-md">
                  Nourish your hair naturally with our premium herbal formula. Experience the power of ancient Ayurvedic wisdom for healthier, stronger hair.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 text-lg font-semibold rounded-md transition-colors duration-200"
                >
                  Order Now
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg font-semibold rounded-md transition-colors duration-200"
                >
                  Learn More
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">100% Natural</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Clinically Tested</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Award Winning</p>
                </div>
              </div>
            </div>

            {/* Right Content - Product Image */}
            <div className="flex justify-center relative">
              <div className="w-80 h-96 bg-gradient-to-b from-amber-100 to-amber-50 rounded-3xl shadow-2xl flex items-center justify-center">
                <div className="w-48 h-72 bg-amber-800 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-black rounded-full"></div>
                  <div className="absolute top-16 left-4 right-4 bg-amber-100 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <Leaf className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h3 className="font-bold text-gray-900 text-sm">Sasya Mantra</h3>
                      <p className="text-xs text-gray-700 mt-1">Herbal Hair</p>
                      <p className="text-xs text-gray-700">Growth Oil</p>
                      <div className="mt-3 flex items-center justify-center">
                        <Leaf className="w-6 h-6 text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 mt-2">100 ml</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-200 rounded-full opacity-60"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-orange-200 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            About Sasya Mantra
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl mx-auto">
            At Sasya Mantra, we believe in the power of nature to nurture and heal. Our herbal hair growth oil is crafted using traditional Ayurvedic recipes passed down through generations, combined with modern scientific research to deliver exceptional results for your hair care needs.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">10,000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">15+</h3>
              <p className="text-gray-600">Natural Ingredients</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">5+</h3>
              <p className="text-gray-600">Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Follow Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
            Follow Us
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Stay connected with us on social media for the latest updates, tips, and exclusive offers.
          </p>
          <div className="flex justify-center space-x-6">
            <Button variant="outline" size="lg" className="rounded-full">
              Facebook
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Instagram
            </Button>
            <Button variant="outline" size="lg" className="rounded-full">
              Twitter
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
