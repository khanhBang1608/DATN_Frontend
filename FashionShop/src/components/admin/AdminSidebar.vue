<template>
  <aside class="side-nav" id="show-side-navigation1">
    <i
      class="fas fa-bars close-aside hidden-sm hidden-md hidden-lg"
      data-close="show-side-navigation1"
    ></i>
    <div class="heading">
      <img src="./Img/Assets/Avatar.jpg" alt="" />
      <div class="info">
        <h3><a href="../">ADMIN</a></h3>
        <p>Thương hiệu Việt vươn tầm quốc tế.</p>
      </div>
    </div>
    <div class="search">
      <input type="text" placeholder="Tìm kiếm" /><i class="fas fa-search"></i>
    </div>
    <ul class="categories">
      <li>
        <i class="fas fa-home fa-fw" aria-hidden="true"></i
        ><router-link to="/dashboard">Thống kê</router-link>
      </li>
      <li><i class="fas fa-headset fa-fw"></i><router-link to="/order">Quản lí đơn</router-link></li>
      <li>
        <i class="fas fa-users fa-fw"></i><a href="#" class="user-li">Người dùng</a>
        <ul class="side-nav-dropdown">
          <li><router-link to="/user">Danh sách người dùng</router-link></li>
          <li><a href="#">Quản lí quyền</a></li>
        </ul>
      </li>
      <li><i class="fas fa-bolt fa-fw"></i><router-link to="/product">Product</router-link></li>
      <li><i class="fas fa-list-ul fa-fw" aria-hidden="true"></i><router-link to="/category">Danh mục</router-link></li>

      <li><i class="far fa-star  fa-fw" aria-hidden="true"></i><router-link to="/review">Đánh giá</router-link></li>
      <li>
        <i class="fas fa-money-bill fa-fw" aria-hidden="true"></i
        ><router-link to="/promotion">Khuyến mãi</router-link>
      </li>
      <li>
        <i class="fas fa-cc-amex" aria-hidden="true"></i
        ><router-link to="/discount">Voucher</router-link>
      </li>

      <p>Nâng Cao:</p>
      <li>
        <i class="fas fa-envelope-open-o fa-fw"></i
        ><a href="#"> Tin Nhắn <span class="num dang">56</span></a>
      </li>
    </ul>
  </aside>
</template>
