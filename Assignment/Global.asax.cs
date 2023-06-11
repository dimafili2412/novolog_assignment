using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace Assignment
{
    public class MvcApplication : System.Web.HttpApplication
    {
        //declaring public vars for DB imitation data (can be used anywhere in project)
        public static dynamic LanguageData { get; private set; }
        public static dynamic ArticlesData { get; private set; }
        public static dynamic DoctorsData { get; private set; }
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            //load data to ram from disk on app start
            LoadData();

        }
        //loading data from json files and storing in global vars
        private void LoadData()
        {
            string basePath = HttpContext.Current.Server.MapPath("~/Data/");

            var languageJson = File.ReadAllText(Path.Combine(basePath, "language.json"));
            MvcApplication.LanguageData = JsonConvert.DeserializeObject<dynamic>(languageJson);

            var articlesJson = File.ReadAllText(Path.Combine(basePath, "articles.json"));
            MvcApplication.ArticlesData = JsonConvert.DeserializeObject<dynamic>(articlesJson);

            var doctorsJson = File.ReadAllText(Path.Combine(basePath, "doctors.json"));
            MvcApplication.DoctorsData = JsonConvert.DeserializeObject<dynamic>(doctorsJson);

        }
    }
}
