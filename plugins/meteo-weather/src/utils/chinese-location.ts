/**
 * 常用中文地名到英文的映射，用于在调用 Open-Meteo 地理编码前将中文输入转为英文。
 * 按 key 长度降序排列，优先匹配长名称（如「北京市」再「北京」）。
 */
const ZH_TO_EN: Record<string, string> = {
  // 直辖市、省会与常用城市（带「市」的放前面）
  北京市: "Beijing",
  上海市: "Shanghai",
  天津市: "Tianjin",
  重庆市: "Chongqing",
  广州市: "Guangzhou",
  深圳市: "Shenzhen",
  杭州市: "Hangzhou",
  南京市: "Nanjing",
  成都市: "Chengdu",
  武汉市: "Wuhan",
  西安市: "Xi'an",
  苏州市: "Suzhou",
  青岛市: "Qingdao",
  大连市: "Dalian",
  厦门市: "Xiamen",
  宁波市: "Ningbo",
  无锡市: "Wuxi",
  长沙市: "Changsha",
  郑州市: "Zhengzhou",
  沈阳市: "Shenyang",
  济南市: "Jinan",
  哈尔滨市: "Harbin",
  福州市: "Fuzhou",
  石家庄市: "Shijiazhuang",
  合肥市: "Hefei",
  南昌市: "Nanchang",
  长春市: "Changchun",
  太原市: "Taiyuan",
  昆明市: "Kunming",
  贵阳市: "Guiyang",
  南宁市: "Nanning",
  兰州市: "Lanzhou",
  海口市: "Haikou",
  乌鲁木齐市: "Urumqi",
  拉萨市: "Lhasa",
  银川市: "Yinchuan",
  西宁市: "Xining",
  香港特别行政区: "Hong Kong",
  澳门特别行政区: "Macau",
  台北市: "Taipei",
  高雄市: "Kaohsiung",
  台中市: "Taichung",
  新北市: "New Taipei",
  桃园市: "Taoyuan",
  // 不带「市」的简称
  北京: "Beijing",
  上海: "Shanghai",
  天津: "Tianjin",
  重庆: "Chongqing",
  广州: "Guangzhou",
  深圳: "Shenzhen",
  杭州: "Hangzhou",
  南京: "Nanjing",
  成都: "Chengdu",
  武汉: "Wuhan",
  西安: "Xi'an",
  苏州: "Suzhou",
  青岛: "Qingdao",
  大连: "Dalian",
  厦门: "Xiamen",
  宁波: "Ningbo",
  无锡: "Wuxi",
  长沙: "Changsha",
  郑州: "Zhengzhou",
  沈阳: "Shenyang",
  济南: "Jinan",
  哈尔滨: "Harbin",
  福州: "Fuzhou",
  石家庄: "Shijiazhuang",
  合肥: "Hefei",
  南昌: "Nanchang",
  长春: "Changchun",
  太原: "Taiyuan",
  昆明: "Kunming",
  贵阳: "Guiyang",
  南宁: "Nanning",
  兰州: "Lanzhou",
  海口: "Haikou",
  乌鲁木齐: "Urumqi",
  拉萨: "Lhasa",
  银川: "Yinchuan",
  西宁: "Xining",
  香港: "Hong Kong",
  澳门: "Macau",
  台北: "Taipei",
  高雄: "Kaohsiung",
  台中: "Taichung",
  台湾: "Taiwan",
}

/** 按 key 长度降序，优先匹配更长地名 */
const SORTED_KEYS = Object.keys(ZH_TO_EN).sort((a, b) => b.length - a.length)

/** 是否包含中文字符（CJK 统一汉字等） */
const CHINESE_REGEX = /[\u4e00-\u9fff\u3400-\u4dbf]/

/**
 * 若输入包含中文，则尝试将已知中文地名替换为英文，便于 Open-Meteo 地理编码识别。
 * 若无中文或未匹配到映射，则返回原字符串。
 */
export function locationToEnglish(input: string): string {
  const trimmed = input.trim()
  if (!trimmed || !CHINESE_REGEX.test(trimmed)) return trimmed

  let result = trimmed
  for (const zh of SORTED_KEYS) {
    result = result.replaceAll(zh, ZH_TO_EN[zh]!)
  }
  return result.trim() || trimmed
}
