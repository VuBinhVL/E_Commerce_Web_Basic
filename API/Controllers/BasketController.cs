using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

        [HttpPost]  //api/basket?productId=1&quantity=3
        public async Task<ActionResult> AddItemToBasket(int productId, int quantity)
        {
            //Get basket || Create basket
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null)
            {
                basket = CreateBasket();
            }

            //Get product
            var product = await _context.Products.FindAsync(productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });

            //Add item
            basket.AddItem(product, quantity);

            //save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (result)
                return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            return BadRequest(new ProblemDetails { Title = "Problem saving item to basket" });
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity)
        {
            //Get basket
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();

            //Remove item || remove quantity
            basket.RemoveItem(productId, quantity);

            //save changes
            var result = await _context.SaveChangesAsync() > 0;
            if (!result) return BadRequest(new ProblemDetails { Title = "Problem removing item from the basket" });

            return Ok();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if (string.IsNullOrEmpty(buyerId))
            {
                Response.Cookies.Delete("buyerId");
                return null;
            }
            return await _context.Baskets
                .Include(i => i.Items)
                .ThenInclude(p => p.Product)
                .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
        private string GetBuyerId()
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            var buyerId = User.Identity?.Name;
            if (string.IsNullOrEmpty(buyerId))
            {
                buyerId = Guid.NewGuid().ToString();
                var cookiesOptions = new CookieOptions
                {
                    IsEssential = true,
                    Expires = DateTime.Now.AddDays(30)
                };
                Response.Cookies.Append("buyerId", buyerId, cookiesOptions);
            }

            var basket = new Basket { BuyerId = buyerId };
            _context.Baskets.Add(basket);
            return basket;
        }

    }
}