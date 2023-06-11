using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Assignment.Controllers
{
    public class HomeController : Controller
    {
        /* 
            GET: Home
            serve index
         */
        public ActionResult Index()
        {
            return View();
        }

    }
}