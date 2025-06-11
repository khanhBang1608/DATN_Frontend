<template>
  <div  id="contents">
        <div class="welcome">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                        <div class="content">
                            <h2>Chào mừng đến với trang quản trị</h2>
                            <p>Thay đổi cả thế giới chỉ với 1 cú click chuột.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <section class="statistics">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <div class="box">
                            <i class="fa fa-envelope fa-fw bg-primary"></i>
                            <div class="info">
                                <h3>1,245</h3> <span> Đánh giá</span>
                                <p>Tổng đánh giá sản phẩm</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="box">
                            <i class="fa fa-file fa-fw danger"></i>
                            <div class="info">
                                <h3>34</h3> <span> Danh mục</span>
                                <p>Các loại sản phẩm</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="box">
                            <i class="fa fa-users fa-fw success"></i>
                            <div class="info">
                                <h3>5,245</h3> <span> Người dùng</span>
                                <p>Chạy chiến dịch</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class="charts">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md-6">
                        <div class="chart-container">
                            <h3>Sản phẩm yêu thích</h3>
                            <canvas id="myChart"></canvas>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="chart-container">
                            <h3>Doanh thu theo tháng</h3>
                            <canvas id="myChart2"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section class='statis text-center'>
            <div class="container-fluid">
                <div class="row">
                    <div class="col-md">
                        <div class="box danger">
                            <i class="fa fa-user-o"></i>
                            <h3>777</h3>
                            <p class="lead">Đơn hàng</p>
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="box warning">
                            <i class="fa fa-shopping-cart"></i>
                            <h3>5,154</h3>
                            <p class="lead">Sản phẩm</p>
                        </div>
                    </div>
                    <div class="col-md">
                        <div class="box success">
                            <i class="fa fa-handshake-o"></i>
                            <h3>5,154$</h3>
                            <p class="lead">Doanh Thu</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
</template>
