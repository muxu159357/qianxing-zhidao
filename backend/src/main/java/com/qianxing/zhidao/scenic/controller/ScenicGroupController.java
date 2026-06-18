package com.qianxing.zhidao.scenic.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.qianxing.zhidao.common.ApiResponse;
import com.qianxing.zhidao.scenic.entity.QxScenicSpot;
import com.qianxing.zhidao.scenic.mapper.QxScenicSpotMapper;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@Tag(name = "scenic-group", description = "景点分组")
@RestController
@RequestMapping("/api/app/scenic")
public class ScenicGroupController {
    private final QxScenicSpotMapper sm;
    public ScenicGroupController(QxScenicSpotMapper s) { sm=s; }
    @GetMapping("/cities") public ApiResponse<List<String>> cities() { var set=new LinkedHashSet<String>(); sm.selectList(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus,1)).forEach(s->{if(s.getCity()!=null)set.add(s.getCity());}); return ApiResponse.ok(new ArrayList<>(set)); }
    @GetMapping("/categories") public ApiResponse<List<String>> categories() { var set=new LinkedHashSet<String>(); sm.selectList(new LambdaQueryWrapper<QxScenicSpot>().eq(QxScenicSpot::getStatus,1)).forEach(s->{if(s.getCategory()!=null)set.add(s.getCategory());}); return ApiResponse.ok(new ArrayList<>(set)); }
}
