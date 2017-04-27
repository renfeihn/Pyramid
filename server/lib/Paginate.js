/**
 * 分页类
 * @param page {Number} 当前页
 * @param perPage {Number} 每页记录数
 * @param total {Number} 总记录数
 * @param items {dict} 当前页记录列表
 */
function Paginate(page, perPage, total, items){
    if(!page || page <1){
        page = 1;
    }
    if(!perPage || perPage<1){
        perPage = 20;
    }
    if(!total || total <0){
        total = 0;
    }
    if(!items){
        items = [];
    }
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.items = items;
    this.currentPageTatol = items.length;
    if(this.total%this.perPage ===0){
        this.pages = parseInt(this.total/this.perPage);
    }else{
        this.pages = parseInt(this.total /this.perPage) + 1;
    }
}

/**
 * 设置当前页数
 * @param page {Number}
 */
Paginate.prototype.setPage = function(page){
    this.page = page;
};

/**
 * 设置每页条数
 * @param perPage
 */
Paginate.prototype.setPerPage = function(perPage){
    this.perPage = perPage;
};

/**
 * 是否有上一页
 * @returns {boolean}
 */
Paginate.prototype.hasPrevPage = function(){
    if(this.page >1){
        return true;
    }
    return false;
};

/**
 * 上一页
 * @returns {number}
 */
Paginate.prototype.prevPage = function(){
    if(this.page <= 1){
        return 1;
    }
    return this.page-1;
};

/**
 * 是否有下一页
 * @returns {boolean}
 */
Paginate.prototype.hasNextPage = function(){
    if(this.page < this.totalPage){
        return true;
    }
    return false;
};

/**
 * 下一页
 * @returns {*}
 */
Paginate.prototype.nextPage = function(){
    if(this.page < this.totalPage){
        return this.page+1;
    }
    return this.totalPage;
};

module.exports = Paginate;