using System.Web;
using System.Web.Optimization;

namespace Assignment
{
    public class BundleConfig
    {
        // For more information on bundling, visit https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            //jquery
            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
            "~/Scripts/jquery-{version}.js"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Scripts/jquery.validate*"));
            //style
            bundles.Add(new StyleBundle("~/Content/css").Include(
                    "~/Content/Home.css"
                ));

            //js scripts
            bundles.Add(new ScriptBundle("~/bundles/javascript").Include(
                    "~/Scripts/DoctorClass.js",
                    "~/Scripts/ContactModalClass.js",
                    "~/Scripts/Home.js"
                ));
        }
    }
}
