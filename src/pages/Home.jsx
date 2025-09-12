import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useTranslation } from "react-i18next";
import heroImg from "../assets/landscape.jpg";
import Lottie from "lottie-react";
import galoAnimation from "../assets/animations/dancing-animation.json";

function Home() {
  const { t } = useTranslation();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [latestImages, setLatestImages] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, "events"));
      const events = querySnapshot.docs.map(doc => doc.data());
      const today = new Date();
      const upcoming = events
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3);
      setUpcomingEvents(upcoming);
    };

    const fetchLatestImages = async () => {
      const querySnapshot = await getDocs(collection(db, "gallery"));
      const images = querySnapshot.docs.map(doc => doc.data());
      const sorted = images.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
      setLatestImages(sorted.slice(0, 6));
    };

    fetchEvents();
    fetchLatestImages();
  }, []);

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      year: date.getFullYear(),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' })
    };
  };

  const formatEventTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5);
  };

  return (
    <div className="bg-[#F1F0E4] min-h-screen font-sans">
      <section
        className="relative hero-min-h md:min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#3E3F29] to-[#7D8D86] overflow-hidden"
      >
        <div className="absolute inset-0">
          <img src={heroImg} alt="Alma da Beira Alta" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3E3F29]/70 via-[#3E3F29]/50 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 pt-16 sm:pt-20">
          
          <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-[#F1F0E4] mb-6 leading-tight">
            <span className="block">Dance,</span>
            <span className="block text-[#BCA88D]">sing and celebrate,</span>
            <span className="block">the Portuguese soul in Luxembourg</span>
          </h1>
          
          <p className="text-lg md:text-xl text-[#F1F0E4]/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            {t("hero_description") || "Join us in preserving and celebrating the rich traditions of Portuguese folklore through dance, music, and community stories that connect us to our heritage."}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <button className="bg-[#BCA88D] hover:bg-[#F1F0E4] hover:text-[#3E3F29] text-[#3E3F29] font-bold px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 min-w-[200px]">
                {t("join_us") || "Join Our Community"}
              </button>
            </Link>
            
            <Link to="/events">
              <button className="border-2 border-[#F1F0E4] text-[#F1F0E4] hover:bg-[#F1F0E4] hover:text-[#3E3F29] font-semibold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 min-w-[200px]">
                {t("view_events") || "View Events"}
              </button>
            </Link>
          </div>
          
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#BCA88D] mb-2">50+</div>
              <div className="text-sm text-[#F1F0E4]/80">{t("active_members") || "Active Members"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#BCA88D] mb-2">1</div>
              <div className="text-sm text-[#F1F0E4]/80">{t("years_active") || "Years Active"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#BCA88D] mb-2">2</div>
              <div className="text-sm text-[#F1F0E4]/80">{t("events_hosted") || "Events Hosted"}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-[#BCA88D] mb-2">1</div>
              <div className="text-sm text-[#F1F0E4]/80">{t("dance_groups") || "Dance Groups"}</div>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#F1F0E4]/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#F1F0E4]/50 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#7D8D86] text-sm font-medium uppercase tracking-wider mb-4">
              {t("our_services") || "OUR SERVICES"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3E3F29] mb-6">
              {t("services_title") || "We Offer Best Services"}
            </h2>
            <p className="text-lg text-[#7D8D86] max-w-2xl mx-auto">
              {t("services_description") || "Discover the rich Portuguese culture through our diverse offerings that connect community, tradition, and heritage."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#BCA88D]/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#3E3F29] mb-3">
                  {t("cultural_events") || "Cultural Events"}
                </h3>
                <p className="text-[#7D8D86] leading-relaxed">
                  {t("cultural_events_desc") || "Join our authentic Portuguese festivals, celebrations, and cultural gatherings throughout the year."}
                </p>
              </div>
              <Link to="/events" className="inline-flex items-center text-[#BCA88D] font-semibold hover:text-[#7D8D86] transition-colors">
                {t("learn_more") || "Learn More"}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#BCA88D]/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7D8D86] to-[#3E3F29] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#3E3F29] mb-3">
                  {t("traditional_dance") || "Traditional Dance"}
                </h3>
                <p className="text-[#7D8D86] leading-relaxed">
                  {t("traditional_dance_desc") || "Learn authentic Portuguese folk dances from experienced instructors in our weekly classes."}
                </p>
              </div>
              <Link to="/activities" className="inline-flex items-center text-[#BCA88D] font-semibold hover:text-[#7D8D86] transition-colors">
                {t("join_classes") || "Join Classes"}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#BCA88D]/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3E3F29] to-[#BCA88D] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#3E3F29] mb-3">
                  {t("portuguese_language") || "Portuguese Language"}
                </h3>
                <p className="text-[#7D8D86] leading-relaxed">
                  {t("portuguese_language_desc") || "Improve your Portuguese through conversation groups and cultural immersion activities."}
                </p>
              </div>
              <Link to="/activities" className="inline-flex items-center text-[#BCA88D] font-semibold hover:text-[#7D8D86] transition-colors">
                {t("practice_with_us") || "Practice With Us"}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-[#BCA88D]/10">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#3E3F29] mb-3">
                  {t("community_support") || "Community Support"}
                </h3>
                <p className="text-[#7D8D86] leading-relaxed">
                  {t("community_support_desc") || "Connect with fellow Portuguese speakers and build lasting friendships in our welcoming community."}
                </p>
              </div>
              <Link to="/register" className="inline-flex items-center text-[#BCA88D] font-semibold hover:text-[#7D8D86] transition-colors">
                {t("join_community") || "Join Community"}
                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

          </div>

          <div className="text-center mt-16">
            <Link to="/register">
              <button className="bg-[#3E3F29] hover:bg-[#7D8D86] text-[#F1F0E4] font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                {t("become_member") || "Become a Member Today"}
              </button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-16">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-[#3E3F29] mb-4">
              {t("who_we_are") || "Who We Are"}
            </h2>
            <p className="text-lg text-[#7D8D86] mb-6">
              {t("who_we_are_text") || "Our ASBL is dedicated to celebrating and sharing the rich traditions of Portuguese folklore in Luxembourg."}
            </p>
            <ul className="space-y-2 text-[#3E3F29]">
              <li><strong>{t("president")}:</strong> Daisy F. Pereira</li>
              <li><strong>{t("vice_president")}:</strong> S. Monteiro Da Silva</li>
              <li><strong>{t("secretary")}:</strong> Ana I. Esteves</li>
              <li><strong>{t("treasurer")}:</strong> Jessica Pereira Braz</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <Lottie
              animationData={galoAnimation}
              loop={true}
              style={{ width: "100%", maxWidth: 320, height: 320 }}
              className="rounded-2xl shadow-lg border-4 border-[#BCA88D] bg-white"
            />
          </div>
        </div>
        <div className="flex justify-center mt-8">
          <Link to="/about">
            <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-[#3E3F29] font-semibold px-8 py-3 rounded-full shadow-lg transition">
              {t("about_us") || "About Us"}
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#7D8D86] text-sm font-medium uppercase tracking-wider mb-4">
              {t("upcoming") || "UPCOMING"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3E3F29] mb-6">
              {t("events_title") || "Top Events & Activities"}
            </h2>
            <p className="text-lg text-[#7D8D86] max-w-2xl mx-auto">
              {t("events_description") || "Join us for authentic Portuguese cultural experiences, from traditional dance performances to community celebrations."}
            </p>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {upcomingEvents.slice(0, 6).map((event, index) => {
                const eventDate = formatEventDate(event.date);
                const eventTime = formatEventTime(event.time);
                
                return (
                  <div
                    key={event.id}
                    className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                  >
                    <div className="relative h-64 overflow-hidden">
                      {event.image ? (
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] flex items-center justify-center">
                          <svg className="w-16 h-16 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-[#3E3F29]">{eventDate.day}</div>
                          <div className="text-xs font-semibold text-[#7D8D86] uppercase">{eventDate.month}</div>
                        </div>
                      </div>

                      <div className="absolute top-4 right-4 bg-[#BCA88D]/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {event.type || t("cultural_event") || "Cultural Event"}
                      </div>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-[#3E3F29] mb-3 line-clamp-2 group-hover:text-[#7D8D86] transition-colors">
                        {event.title}
                      </h3>

                      <p className="text-[#7D8D86] mb-4 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center text-sm text-[#7D8D86]">
                          <svg className="w-4 h-4 mr-2 text-[#BCA88D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{eventDate.weekday}, {eventDate.month} {eventDate.day}</span>
                          {eventTime && <span className="ml-2">at {eventTime}</span>}
                        </div>

                        {event.location && (
                          <div className="flex items-center text-sm text-[#7D8D86]">
                            <svg className="w-4 h-4 mr-2 text-[#BCA88D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span className="line-clamp-1">{event.location}</span>
                          </div>
                        )}

                        {event.price && (
                          <div className="flex items-center text-sm">
                            <svg className="w-4 h-4 mr-2 text-[#BCA88D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="font-semibold text-[#3E3F29]">{event.price}</span>
                          </div>
                        )}
                      </div>

                      <Link to={`/events/${event.id}`}>
                        <button className="w-full bg-[#3E3F29] hover:bg-[#7D8D86] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg">
                          {t("learn_more") || "Learn More"}
                          <svg className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#BCA88D]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#BCA88D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3E3F29] mb-4">
                {t("no_upcoming_events") || "No Upcoming Events"}
              </h3>
              <p className="text-[#7D8D86] mb-8 max-w-md mx-auto">
                {t("no_events_description") || "Stay tuned! We're planning exciting cultural events and activities. Check back soon or subscribe to our newsletter."}
              </p>
              <Link to="/events">
                <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                  {t("view_all_events") || "View All Events"}
                </button>
              </Link>
            </div>
          )}

          {upcomingEvents.length > 0 && (
            <div className="text-center">
              <Link to="/events">
                <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                  {t("view_all_events") || "View All Events"}
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#7D8D86] text-sm font-medium uppercase tracking-wider mb-4">
              {t("gallery") || "GALLERY"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3E3F29] mb-6">
              {t("gallery_title") || "Moments That Define Us"}
            </h2>
            <p className="text-lg text-[#7D8D86] max-w-2xl mx-auto">
              {t("gallery_description") || "Discover the vibrant moments from our cultural events, dance performances, and community celebrations."}
            </p>
          </div>

          {latestImages.length > 0 ? (
            <div className="mb-12">
              <div className="mb-8">
                <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden group shadow-2xl">
                  <img
                    src={latestImages[0].url}
                    alt={latestImages[0].title || "Gallery Image"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-8 left-8 right-8">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6">
                      <h3 className="text-2xl font-bold text-[#3E3F29] mb-2">
                        {latestImages[0].title || t("featured_moment") || "Featured Moment"}
                      </h3>
                      <p className="text-[#7D8D86]">
                        {latestImages[0].description || t("latest_from_our_community") || "Latest from our community events and celebrations"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {latestImages.slice(1, 9).map((image, index) => (
                  <div
                    key={image.id || index}
                    className={`relative group rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                      index === 0 || index === 3 ? 'md:col-span-2 md:row-span-2' : ''
                    }`}
                  >
                    <div className={`relative overflow-hidden ${
                      index === 0 || index === 3 ? 'h-64 md:h-80' : 'h-32 md:h-40'
                    }`}>
                      <img
                        src={image.url}
                        alt={image.title || `Gallery image ${index + 2}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-center text-white">
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-sm font-medium">View Photo</span>
                        </div>
                      </div>
                    </div>

                    {(index === 0 || index === 3) && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h4 className="text-white font-semibold mb-1">
                          {image.title || `Event ${index + 2}`}
                        </h4>
                        <p className="text-white/80 text-sm">
                          {image.date || t("recent_event") || "Recent Event"}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-6 bg-[#F1F0E4] rounded-2xl">
                  <div className="text-3xl font-bold text-[#3E3F29] mb-2">{latestImages.length}+</div>
                  <div className="text-sm text-[#7D8D86] font-medium">{t("photos_shared") || "Photos Shared"}</div>
                </div>
                <div className="text-center p-6 bg-[#F1F0E4] rounded-2xl">
                  <div className="text-3xl font-bold text-[#3E3F29] mb-2">50+</div>
                  <div className="text-sm text-[#7D8D86] font-medium">{t("events_captured") || "Events Captured"}</div>
                </div>
                <div className="text-center p-6 bg-[#F1F0E4] rounded-2xl">
                  <div className="text-3xl font-bold text-[#3E3F29] mb-2">100+</div>
                  <div className="text-sm text-[#7D8D86] font-medium">{t("memories_created") || "Memories Created"}</div>
                </div>
                <div className="text-center p-6 bg-[#F1F0E4] rounded-2xl">
                  <div className="text-3xl font-bold text-[#3E3F29] mb-2">15+</div>
                  <div className="text-sm text-[#7D8D86] font-medium">{t("years_documented") || "Years Documented"}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[#BCA88D]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#BCA88D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#3E3F29] mb-4">
                {t("no_gallery_images") || "Gallery Coming Soon"}
              </h3>
              <p className="text-[#7D8D86] mb-8 max-w-md mx-auto">
                {t("no_images_description") || "We're collecting beautiful moments from our events and activities. Check back soon to see our community in action!"}
              </p>
              <Link to="/gallery">
                <button className="bg-[#BCA88D] hover:bg-[#7D8D86] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                  {t("view_full_gallery") || "View Full Gallery"}
                </button>
              </Link>
            </div>
          )}

          {latestImages.length > 0 && (
            <div className="text-center">
              <Link to="/gallery">
                <button className="bg-[#3E3F29] hover:bg-[#7D8D86] text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105">
                  {t("explore_full_gallery") || "Explore Full Gallery"}
                  <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F1F0E4] py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-[#7D8D86] text-sm font-medium uppercase tracking-wider mb-4">
              {t("membership") || "MEMBERSHIP"}
            </p>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#3E3F29] mb-6">
              {t("join_title") || "Join Our Community In 3 Easy Steps"}
            </h2>
            <p className="text-lg text-[#7D8D86] max-w-2xl mx-auto">
              {t("join_description") || "Becoming part of our Portuguese cultural family is simple. Follow these steps to start your journey with us."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#BCA88D]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#BCA88D] to-[#7D8D86] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                
                <div className="w-12 h-12 bg-[#F1F0E4] rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-6 h-6 text-[#3E3F29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#3E3F29] mb-4 text-center">
                  {t("step_1_title") || "Fill Registration Form"}
                </h3>
                <p className="text-[#7D8D86] text-center leading-relaxed mb-6">
                  {t("step_1_description") || "Complete our simple online registration form with your basic information and interests in Portuguese culture."}
                </p>

                <ul className="space-y-2 text-sm text-[#7D8D86]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("personal_info") || "Personal Information"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("cultural_interests") || "Cultural Interests"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("experience_level") || "Experience Level"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#BCA88D]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#7D8D86] to-[#3E3F29] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                
                <div className="w-12 h-12 bg-[#F1F0E4] rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-6 h-6 text-[#3E3F29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#3E3F29] mb-4 text-center">
                  {t("step_2_title") || "Review & Approval"}
                </h3>
                <p className="text-[#7D8D86] text-center leading-relaxed mb-6">
                  {t("step_2_description") || "Our team will review your application and reach out to you within 48 hours with next steps and membership details."}
                </p>

                <ul className="space-y-2 text-sm text-[#7D8D86]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("quick_review") || "Quick Review Process"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("personal_contact") || "Personal Contact"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("membership_info") || "Membership Information"}
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative group">
              <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-[#BCA88D]/20">
                <div className="w-16 h-16 bg-gradient-to-br from-[#3E3F29] to-[#BCA88D] rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                
                <div className="w-12 h-12 bg-[#F1F0E4] rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <svg className="w-6 h-6 text-[#3E3F29]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-[#3E3F29] mb-4 text-center">
                  {t("step_3_title") || "Welcome & Start Participating"}
                </h3>
                <p className="text-[#7D8D86] text-center leading-relaxed mb-6">
                  {t("step_3_description") || "Join our welcoming community! Attend events, participate in dance classes, and become part of our Portuguese family."}
                </p>

                <ul className="space-y-2 text-sm text-[#7D8D86]">
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("orientation_session") || "Orientation Session"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("access_to_events") || "Access to All Events"}
                  </li>
                  <li className="flex items-center">
                    <svg className="w-4 h-4 text-[#BCA88D] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {t("community_support") || "Community Support"}
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div className="text-center">
            <Link to="/register">
              <button className="bg-[#3E3F29] hover:bg-[#7D8D86] text-white font-bold px-12 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 mb-4">
                {t("start_your_journey") || "Start Your Journey Today"}
              </button>
            </Link>
            <p className="text-sm text-[#7D8D86]">
              {t("join_cta_note") || "Questions? Contact us at info@almadabeiraalta.lu"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;