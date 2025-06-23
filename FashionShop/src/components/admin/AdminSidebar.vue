<template>
  <aside class="side-nav" id="show-side-navigation1">
    <i
      class="fa fa-bars close-aside hidden-sm hidden-md hidden-lg"
      data-close="show-side-navigation1"
    ></i>
    <div class="heading">
      <img src="./Img/Assets/Avatar.jpg" alt="" />
      <div class="info">
        <h3><a href="#">ADMIN</a></h3>
        <p>Thương hiệu Việt vươn tầm quốc tế.</p>
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="Tìm kiếm" /><i class="fa fa-search"></i>
    </div>
    <ul class="categories">
      <li>
        <i class="fa fa-home fa-fw" aria-hidden="true"></i
        ><router-link to="/dashboard">Thống kê</router-link>
      </li>
      <li><i class="fa fa-support fa-fw"></i><router-link to="/order">Quản lí đơn</router-link></li>
      <li>
        <i class="fa fa-users fa-fw"></i><a href="#" class="user-li">Người dùng</a>
        <ul class="side-nav-dropdown">
          <li><router-link to="/user">Danh sách người dùng</router-link></li>
          <li><a href="#">Quản lí quyền</a></li>
        </ul>
      </li>
      <li><i class="fa fa-bolt fa-fw"></i><router-link to="/product">Product</router-link></li>
      <li><i class="fa fa-list-ul fa-fw" aria-hidden="true"></i><router-link to="/category">Danh mục</router-link></li>

      <li><i class="fa fa-star-o fa-fw" aria-hidden="true"></i><router-link to="/review">Đánh giá</router-link></li>
      <li>
        <i class="fa fa-money fa-fw" aria-hidden="true"></i
        ><router-link to="/promotion">Khuyến mãi</router-link>
      </li>
      <li>
        <i class="fa fa-cc-amex" aria-hidden="true"></i
        ><router-link to="/discount">Voucher</router-link>
      </li>

      <p>Nâng Cao:</p>
      <li>
        <i class="fa fa-envelope-open-o fa-fw"></i
        ><a href="#"> Tin Nhắn <span class="num dang">56</span></a>
      </li>
      <li>
        <i class="fa fa-wrench fa-fw"></i><a href="#"> Cài Đặt <span class="num prim">6</span></a>
        <ul class="side-nav-dropdown">
          <li><a href="#">Lỗi Hệ Thống</a></li>
          <li><a href="#">SP Hết Hàng</a></li>
          <li><a href="#">Trang</a></li>
          <li><a href="#">Chiến Dịch</a></li>
          <li><a href="#">Tất Cả</a></li>
        </ul>
      </li>
      <li>
        <i class="fa fa-laptop fa-fw"></i
        ><a href="#"> Thông Tin App<span class="num succ">1</span></a>
      </li>
      <li><i class="fa fa-comments-o fa-fw"></i><a href="#"> Nhiều Hơn Nữa</a></li>
    </ul>
  </aside>
</template>
