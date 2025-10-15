@echo off
echo Deleting corrupted files...

del "src\main\java\com\ecommerce\dto\CreateOrderRequest.java"
del "src\main\java\com\ecommerce\dto\OrderDto.java"
del "src\main\java\com\ecommerce\dto\OrderItemDto.java"
del "src\main\java\com\ecommerce\dto\ProductDto.java"
del "src\main\java\com\ecommerce\dto\ProductFilterDto.java"
del "src\main\java\com\ecommerce\dto\UpdateUserRequest.java"
del "src\main\java\com\ecommerce\dto\UserDto.java"
del "src\main\java\com\ecommerce\model\Product.java"
del "src\main\java\com\ecommerce\security\JwtUtil.java"
del "src\main\java\com\ecommerce\service\AuthService.java"
del "src\main\java\com\ecommerce\service\CategoryService.java"
del "src\main\java\com\ecommerce\service\OrderService.java"
del "src\main\java\com\ecommerce\service\ProductService.java"
del "src\main\java\com\ecommerce\service\UserService.java"

echo Files deleted. Now recreating them...
echo Done!
