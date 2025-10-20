import React from 'react';

const AboutPage = () => {
  return (
    <div className="px-6 md:px-16 py-12 bg-[#FFEFD5] text-[#2F2F2F] font-sans">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Về FUHUSU Bookstore</h1>
        <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-8">
          FUHUSU Bookstore được thành lập với sứ mệnh lan tỏa tri thức và nuôi dưỡng đam mê đọc sách đến cộng đồng.
          Chúng tôi tin rằng mỗi cuốn sách đều có sức mạnh thay đổi cuộc đời – chỉ cần bạn sẵn sàng mở nó ra và bắt đầu hành trình.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
        <div>
          <img src="/images/protection.png" alt="Sứ mệnh" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Sứ mệnh</h3>
          <p className="text-gray-600 text-sm">
            Mang đến những đầu sách chất lượng, dễ tiếp cận cho mọi lứa tuổi và tầng lớp độc giả Việt Nam.
          </p>
        </div>
        <div>
          <img src="/images/share.png" alt="Tầm nhìn" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Tầm nhìn</h3>
          <p className="text-gray-600 text-sm">
            Trở thành một trong những nền tảng sách trực tuyến hàng đầu tại Việt Nam, nơi hội tụ của kiến thức và cảm hứng sống.
          </p>
        </div>
        <div>
          <img src="/images/customer.png" alt="Giá trị cốt lõi" className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Giá trị cốt lõi</h3>
          <p className="text-gray-600 text-sm">
            Chất lượng – Tận tâm – Đổi mới – Đồng hành cùng người đọc trên mọi hành trình.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mt-16">
        <h2 className="text-2xl font-semibold mb-4">Cảm ơn bạn đã đồng hành cùng FUHUSU</h2>
        <p className="text-gray-700 text-sm md:text-base">
          Chúng tôi không chỉ bán sách – chúng tôi gửi gắm tri thức, truyền cảm hứng và mở rộng thế giới cho từng người đọc.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
