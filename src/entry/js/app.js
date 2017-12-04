require('angular');
require('lodash');

const common = require('../../common/common');

const pageHome = require('../../pages/page-home/page-home');

$(function() {

	common.init();
	// header.init();
	// footer.init();

	pageHome.init();
});
