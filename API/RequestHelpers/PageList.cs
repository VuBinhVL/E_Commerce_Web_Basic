using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PageList<T> : List<T>
    {
        public MetaData MetaData { get; set; }
        public PageList(IQueryable<T> items, int count, int PageNumber, int PageSize)
        {
            MetaData = new MetaData
            {
                CurrentPage = PageNumber,
                TotalPages = (int)Math.Ceiling(count / (double)PageSize),
                PageSize = PageSize,
                TotalCount = count
            };
            this.AddRange(items); // Thêm các item vào danh sách hiện tại
        }

        public static async Task<PageList<T>> ToPageList(IQueryable<T> query, int pageNumber, int pageSize)
        {
            var count = await query.CountAsync(); // Tổng số item trong danh sách ban đầu
            var items = await query.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync(); // Lấy các item cho trang hiện tại
            return new PageList<T>(items.AsQueryable(), count, pageNumber, pageSize);
        }
    }
}