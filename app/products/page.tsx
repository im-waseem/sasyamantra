import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Star, Shield, Award, Heart } from 'lucide-react';

export default function Products() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-green-600">Products</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Discover our range of premium natural hair care products, crafted with love and ancient wisdom.
          </p>
        </div>
      </section>

      {/* Featured Product */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-green-100 text-green-800 hover:bg-green-100">
              Featured Product
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Herbal Hair Growth Oil</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our flagship product combines 15+ carefully selected herbs in a potent formula designed to nourish your scalp and promote healthy hair growth.
            </p>
          </div>
          
          <Card className="shadow-xl max-w-4xl mx-auto">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Product Image */}
                <div className="flex justify-center">
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
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-current" />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">(1,234 reviews)</span>
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">₹299</span>
                      <span className="text-xl text-gray-500 line-through">349</span>
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">31% OFF</Badge>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Key Benefits:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <Leaf className="w-5 h-5 text-green-600 mr-3" />
                        <span>Promotes natural hair growth</span>
                      </li>
                      <li className="flex items-center">
                        <Heart className="w-5 h-5 text-green-600 mr-3" />
                        <span>Nourishes scalp deeply</span>
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 text-green-600 mr-3" />
                        <span>Prevents hair fall</span>
                      </li>
                      <li className="flex items-center">
                        <Star className="w-5 h-5 text-green-600 mr-3" />
                        <span>Adds natural shine and strength</span>
                      </li>
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">100ml</p>
                      <p className="text-sm text-gray-600">Volume</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">30</p>
                      <p className="text-sm text-gray-600">Days Supply</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                      Add to Cart - ₹299
                    </Button>
                    <Button variant="outline" size="lg" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Ingredients Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Natural Ingredients</h2>
            <p className="text-lg text-gray-600">
              Our formula contains powerful herbs known for their hair care benefits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Bhringraj", benefit: "Promotes hair growth", description: "Known as the 'King of Hair' in Ayurveda" },
              { name: "Amla", benefit: "Rich in Vitamin C", description: "Strengthens hair follicles naturally" },
              { name: "Coconut Oil", benefit: "Deep moisturization", description: "Nourishes hair from root to tip" },
              { name: "Neem", benefit: "Anti-bacterial", description: "Keeps scalp healthy and clean" },
              { name: "Fenugreek", benefit: "Prevents hair fall", description: "Rich in proteins and nutrients" },
              { name: "Brahmi", benefit: "Stress relief", description: "Calms scalp and reduces hair loss" }
            ].map((ingredient, index) => (
              <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-200">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Leaf className="w-6 h-6 text-green-600" />
                  </div>
                  <CardTitle className="text-center text-lg">{ingredient.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <Badge className="mb-2 bg-green-100 text-green-800 hover:bg-green-100">
                    {ingredient.benefit}
                  </Badge>
                  <p className="text-gray-600 text-sm">{ingredient.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-lg text-gray-600">
              Simple steps for maximum benefits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Apply",
                description: "Take 3-4 drops and apply to scalp and hair roots"
              },
              {
                step: "2",
                title: "Massage",
                description: "Gently massage for 5-10 minutes in circular motions"
              },
              {
                step: "3",
                title: "Leave",
                description: "Leave overnight or for at least 2 hours before washing"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-lg text-gray-600">
              Real results from real people
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya K.",
                rating: 5,
                review: "Amazing results! My hair fall reduced significantly within 3 weeks of use."
              },
              {
                name: "Rajesh M.",
                rating: 5,
                review: "Love the natural fragrance and how soft my hair feels after each use."
              },
              {
                name: "Meera S.",
                rating: 5,
                review: "Finally found a product that works! My hair is thicker and healthier now."
              }
            ].map((testimonial, index) => (
              <Card key={index} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 italic mb-4">"{testimonial.review}"</p>
                  <p className="font-semibold text-gray-900">- {testimonial.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}