"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, ThumbsUp, MessageSquare, Award } from 'lucide-react';
import { useState } from 'react';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    product: '',
    feedback: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Feedback submitted:', { ...formData, rating });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const recentFeedback = [
    {
      name: "Anjali P.",
      rating: 5,
      product: "Herbal Hair Growth Oil",
      feedback: "Excellent product! My hair has never looked better.",
      date: "2 days ago"
    },
    {
      name: "Vikram S.",
      rating: 5,
      product: "Herbal Hair Growth Oil",
      feedback: "Natural ingredients really work. Highly recommended!",
      date: "1 week ago"
    },
    {
      name: "Sunita R.",
      rating: 4,
      product: "Herbal Hair Growth Oil",
      feedback: "Good quality product. Seeing positive results.",
      date: "2 weeks ago"
    }
  ];

  const stats = [
    { icon: ThumbsUp, label: "Satisfied Customers", value: "98%" },
    { icon: Star, label: "Average Rating", value: "4.8" },
    { icon: MessageSquare, label: "Total Reviews", value: "1,234" },
    { icon: Award, label: "5-Star Reviews", value: "89%" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Your <span className="text-green-600">Feedback</span> Matters
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Help us improve our products and services. Share your experience with Sasya Mantra.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feedback Form and Recent Reviews */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feedback Form */}
            <div>
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    Share Your Experience
                  </CardTitle>
                  <p className="text-gray-600">
                    Your feedback helps us serve you better and improve our products.
                  </p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          required
                          value={formData.name}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="product">Product Used</Label>
                      <select
                        id="product"
                        name="product"
                        value={formData.product}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      >
                        <option value="">Select a product</option>
                        <option value="herbal-hair-growth-oil">Herbal Hair Growth Oil</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label className="mb-3 block">Rate Your Experience</Label>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`w-8 h-8 ${
                              star <= rating 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-300'
                            } hover:text-yellow-400 transition-colors`}
                          >
                            <Star className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="feedback">Your Feedback *</Label>
                      <Textarea
                        id="feedback"
                        name="feedback"
                        rows={5}
                        required
                        value={formData.feedback}
                        onChange={handleChange}
                        className="mt-1"
                        placeholder="Tell us about your experience with our products..."
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      Submit Feedback
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Recent Feedback */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Customer Reviews</h2>
                <p className="text-gray-600">See what other customers are saying about our products.</p>
              </div>
              
              <div className="space-y-6">
                {recentFeedback.map((review, index) => (
                  <Card key={index} className="shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{review.name}</h3>
                          <p className="text-sm text-gray-500">{review.date}</p>
                        </div>
                        <div className="flex text-yellow-400">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      
                      <Badge className="mb-3 bg-green-100 text-green-800 hover:bg-green-100">
                        {review.product}
                      </Badge>
                      
                      <p className="text-gray-600 italic">"{review.feedback}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                  View All Reviews
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Love Our Products?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Share your success story and help others discover the benefits of natural hair care.
          </p>
          <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
            Write a Review
          </Button>
        </div>
      </section>
    </div>
  );
}