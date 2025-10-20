using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrderController : BaseApiController
    {

        private readonly StoreContext _context;
        public OrderController(StoreContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }
        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            return await _context.Orders
                .ProjectOrderToOrderDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto order)
        {
            var basket = await _context.Baskets
                .RetrieveBasketWithItems(User.Identity.Name)
                .FirstOrDefaultAsync();

            if (basket == null) return BadRequest(new ProblemDetails { Title = "Could not locate basket" });

            var items = new List<OrderItem>();

            foreach (var item in basket.Items)
            {
                var productItem = await _context.Products.FindAsync(item.ProductId);
                if (productItem == null) return BadRequest(new ProblemDetails { Title = "Could not find product" });

                var itemOrdered = new ProductItemOrdered
                {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                var orderItem = new OrderItem
                {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var shippingFee = subtotal > 10000 ? 0 : 500;

            var orderToCreate = new Order
            {
                BuyerId = User.Identity.Name,
                ShippingAddress = order.ShippingAddress,
                OrderItems = items,
                Subtotal = subtotal,
                ShippingFee = shippingFee,
                PaymentIntentId = basket.PaymentIntentId
            };

            _context.Orders.Add(orderToCreate);
            _context.Baskets.Remove(basket);

            if (order.SaveAddress)
            {
                var user = await _context.Users
                    .Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                if (user != null)
                {
                    var address = new UserAddress
                    {
                        FullName = order.ShippingAddress.FullName,
                        Address1 = order.ShippingAddress.Address1,
                        Address2 = order.ShippingAddress.Address2,
                        City = order.ShippingAddress.City,
                        State = order.ShippingAddress.State,
                        Zip = order.ShippingAddress.Zip,
                        Country = order.ShippingAddress.Country
                    };
                    user.Address = address;
                }
            }

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return CreatedAtAction("GetOrder", new { id = orderToCreate.Id }, orderToCreate.Id);

            return BadRequest(new ProblemDetails { Title = "Problem creating order" });
        }
    }
}