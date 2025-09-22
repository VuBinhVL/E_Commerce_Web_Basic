using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.RequestHelpers
{
    public class PaginationParams
    {
        private const int MaxPageSize = 50; // Giới hạn số item tối đa trên 1 trang
        public int PageNumber { get; set; } = 1; // Trang hiện tại, mặc định là trang 1 
        private int _pageSize = 6;  // Số item trên mỗi trang, mặc định là 6
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
            // Giới hạn số item tối đa trên mỗi trang không vượt quá MaxPageSize
        }
    }
}