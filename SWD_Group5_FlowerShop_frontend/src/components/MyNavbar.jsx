// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaSearch, FaUser, FaShoppingCart, FaBook, FaTags, FaFire, FaGlobe, FaCaretDown, FaBars, FaTimes } from 'react-icons/fa';

// export default function MyNavbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => {
//     setIsMenuOpen(!isMenuOpen);
//   };

//   return (
//     <BootstrapNavbar style={navbarBackgroundStyle} expand="lg" className="py-3">
//       <Container>
//         <BootstrapNavbar.Brand as={Link} to="/" style={{ ...blackTextStyle, fontSize: '2em' }}>
//           BookVerse
//         </BootstrapNavbar.Brand>

//         <BootstrapNavbar.Toggle aria-controls="main-navbar-nav" />

//         <BootstrapNavbar.Collapse id="main-navbar-nav">
//           <Nav className="mx-auto">
//             <Nav.Link as={Link} to="/sach-moi" style={blackTextStyle}>
//               <span style={contentStyle}><FaBook /> Sách Mới</span>
//             </Nav.Link>
//             <span style={blackSeparatorStyle}>|</span>
//             <Nav.Link as={Link} to="/sach-ban-chay" style={blackTextStyle}>
//               <span style={contentStyle}><FaFire /> Sách Bán Chạy</span>
//             </Nav.Link>
//             <span style={blackSeparatorStyle}>|</span>
            
//             {/* NavDropdown sử dụng thuộc tính title */}
//             <NavDropdown
//               title={
//                 <span style={contentStyle}>
//                   <FaTags /> Thể loại <FaCaretDown /> {/* Icon, chữ và mũi tên tùy chỉnh */}
//                 </span>
//               }
//               id="the-loai-dropdown"
//               style={blackTextStyle}
//               className="no-caret" // Vẫn giữ class này để nhắm mục tiêu
//             >
//               <NavDropdown.Item as={Link} to="/the-loai/van-hoc">Văn học</NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/the-loai/khoa-hoc">Khoa học</NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/the-loai/lich-su">Lịch sử</NavDropdown.Item>
//               <NavDropdown.Item as={Link} to="/the-loai/thieu-nhi">Thiếu nhi</NavDropdown.Item>
//               <NavDropdown.Divider />
//               <NavDropdown.Item as={Link} to="/the-loai/tat-ca">Xem tất cả thể loại</NavDropdown.Item>
//             </NavDropdown>
//             <span style={blackSeparatorStyle}>|</span>

//             <Nav.Link as={Link} to="/sach-giam-gia" style={blackTextStyle}>Sách Giảm Giá</Nav.Link>
//             <span style={blackSeparatorStyle}>|</span>

//             <Nav.Link as={Link} to="/tac-gia" style={blackTextStyle}>Tác giả</Nav.Link>
//             <span style={blackSeparatorStyle}>|</span>

//             <Nav.Link as={Link} to="/nha-xuat-ban" style={blackTextStyle}>Nhà xuất bản</Nav.Link>
//           </Nav>

//           <Nav>
//             <Nav.Link href="#" style={iconStyle}><FaSearch /></Nav.Link>
//             <Nav.Link as={Link} to="/user-profile" style={iconStyle}><FaUser /></Nav.Link>
//             <Nav.Link as={Link} to="/cart" style={iconStyle}>
//               <FaShoppingCart />
//               <span className="badge bg-danger ms-1">0</span>
//             </Nav.Link>
//           </Nav>
//         </BootstrapNavbar.Collapse>
//       </Container>
//     </BootstrapNavbar>
//   );
// }