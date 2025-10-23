"use client";

export default function ContactSection() {
  return (
    <section
      className="flex items-center justify-center px-4 py-16"
      style={{
        background: "linear-gradient(to bottom, #f9f9f6 0%, #000000 100%)",
      }}
    >
      <div className="max-w-7xl w-full bg-[#fefdeb] rounded-md shadow-md p-8 md:p-10">
        <h2 className="text-center text-lg md:text-xl font-semibold text-black mb-6">
          For any inquiries:
        </h2>

        <form className="space-y-4">
          {/* Email Field */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white placeholder:text-gray-400"
              required
            />
          </div>

          {/* Subject Field */}
          <div>
            <input
              type="text"
              placeholder="Subject"
              className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white placeholder:text-gray-400"
              required
            />
          </div>

          {/* Message Field */}
          <div>
            <textarea
              placeholder="Message"
              rows="5"
              className="w-full border border-gray-200 rounded-md p-3 outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white resize-none placeholder:text-gray-400"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 rounded-md transition-all shadow-sm hover:shadow-md"
          >
            Submit
          </button>
        </form>
      </div>
    </section>
  );
}
