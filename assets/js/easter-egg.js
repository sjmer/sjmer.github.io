/* sjmer.top — 隐藏小彩蛋（双击篮球图标，或拖向「跳」卡片触发） */
(function () {
  var slot = document.getElementById('interestsSlot');
  var grid = document.getElementById('interestsGrid');
  var danceCard = document.getElementById('danceCard');
  var danceIcon = document.getElementById('danceIcon');
  var ballIcon = document.getElementById('ballIcon');
  if (!slot || !grid || !danceCard || !danceIcon || !ballIcon) return;

  var isPlaying = false;
  var isLaunching = false;
  var DURATION = 7800;
  var HOLD_AFTER_END = 450; // 谢幕定格短暂停顿后立即收起
  var THIGH = 36, SHIN = 36, UPPER = 27, FORE = 26, TORSO_LEN = 46;

  var KEYFRAMES = [
    // 阶段一：起手运球
    {
      t: 0.00,
      hipX: 210, hipY: 152, lean: -4, turn: 1, isBack: false, headTilt: -5, hairWhip: 0,
      lLift: 0, rLift: 0,
      lThigh: -14, lShin: 6, rThigh: 16, rShin: -4,
      lUpper: -34, lFore: 68, rUpper: 42, rFore: 148,
      ballX: 250, ballY: 86, ballSpin: 0, ballSx: 1, ballSy: 1
    },
    {
      t: 0.075,
      hipX: 222, hipY: 162, lean: 12, turn: 0.9, isBack: false, headTilt: 8, hairWhip: 10,
      lLift: 0, rLift: 2,
      lThigh: -32, lShin: 16, rThigh: 36, rShin: -16,
      lUpper: -46, lFore: 52, rUpper: 40, rFore: 14,
      ballX: 256, ballY: 208, ballSpin: 160, ballSx: 1.15, ballSy: 0.85,
      fx: 'bounce', fxX: 256
    },
    {
      t: 0.16,
      hipX: 198, hipY: 162, lean: -12, turn: 0.9, isBack: false, headTilt: -8, hairWhip: -12,
      lLift: 2, rLift: 0,
      lThigh: -36, lShin: 16, rThigh: 32, rShin: -16,
      lUpper: -40, lFore: -14, rUpper: 46, rFore: -52,
      ballX: 164, ballY: 208, ballSpin: 340, ballSx: 1.15, ballSy: 0.85,
      fx: 'bounce', fxX: 164
    },
    {
      t: 0.245,
      hipX: 212, hipY: 152, lean: 6, turn: 0.8, isBack: false, headTilt: 6, hairWhip: 14,
      lLift: 0, rLift: -2,
      lThigh: -14, lShin: 4, rThigh: 18, rShin: -4,
      lUpper: -42, lFore: 64, rUpper: 82, rFore: 138,
      ballX: 280, ballY: 96, ballSpin: 560, ballSx: 1, ballSy: 1
    },

    // 阶段二：背身大开腿卡点扭肩
    {
      t: 0.295,
      hipX: 210, hipY: 158, lean: -4, turn: 0.95, isBack: true, headTilt: -4, hairWhip: 0,
      lLift: -5, rLift: 3,
      lThigh: -32, lShin: -10, rThigh: 32, rShin: 10,
      lUpper: -56, lFore: 108, rUpper: 56, rFore: -108,
      ballX: 460, ballY: 40, ballSpin: 720, ballSx: 1, ballSy: 1,
      fx: 'shrug'
    },
    {
      t: 0.355,
      hipX: 217, hipY: 159, lean: 8, turn: 0.95, isBack: true, headTilt: 6, hairWhip: 0,
      lLift: 3, rLift: -6,
      lThigh: -28, lShin: -8, rThigh: 36, rShin: 10,
      lUpper: -50, lFore: 104, rUpper: 64, rFore: -112,
      ballX: 460, ballY: 40, ballSpin: 720, ballSx: 1, ballSy: 1
    },
    {
      t: 0.415,
      hipX: 203, hipY: 159, lean: -8, turn: 0.95, isBack: true, headTilt: -6, hairWhip: 0,
      lLift: -6, rLift: 3,
      lThigh: -36, lShin: -10, rThigh: 28, rShin: 8,
      lUpper: -64, lFore: 112, rUpper: 50, rFore: -104,
      ballX: 460, ballY: 40, ballSpin: 720, ballSx: 1, ballSy: 1
    },
    {
      t: 0.475,
      hipX: 217, hipY: 159, lean: 8, turn: 0.95, isBack: true, headTilt: 6, hairWhip: 0,
      lLift: 3, rLift: -6,
      lThigh: -28, lShin: -8, rThigh: 36, rShin: 10,
      lUpper: -50, lFore: 104, rUpper: 64, rFore: -112,
      ballX: 460, ballY: 40, ballSpin: 720, ballSx: 1, ballSy: 1
    },

    // 阶段三：正面松弛抖肩四连拍
    {
      t: 0.545,
      hipX: 208, hipY: 152, lean: -4, turn: 0.96, isBack: false, headTilt: 5, hairWhip: -10,
      lLift: -6, rLift: 3,
      lThigh: -14, lShin: 4, rThigh: 14, rShin: -4,
      lUpper: -30, lFore: 46, rUpper: 24, rFore: -34,
      ballX: -50, ballY: 90, ballSpin: 720, ballSx: 1, ballSy: 1,
      fx: 'shrugFront'
    },
    {
      t: 0.61,
      hipX: 214, hipY: 153, lean: 5, turn: 0.96, isBack: false, headTilt: -6, hairWhip: 8,
      lLift: 3, rLift: -6.5,
      lThigh: -14, lShin: 4, rThigh: 14, rShin: -4,
      lUpper: -24, lFore: 34, rUpper: 34, rFore: -54,
      ballX: -50, ballY: 90, ballSpin: 720, ballSx: 1, ballSy: 1
    },
    {
      t: 0.675,
      hipX: 206, hipY: 153, lean: -5, turn: 0.96, isBack: false, headTilt: 6, hairWhip: -8,
      lLift: -6.5, rLift: 3,
      lThigh: -14, lShin: 4, rThigh: 14, rShin: -4,
      lUpper: -34, lFore: 54, rUpper: 24, rFore: -34,
      ballX: -50, ballY: 90, ballSpin: 720, ballSx: 1, ballSy: 1
    },
    {
      t: 0.74,
      hipX: 214, hipY: 153, lean: 5, turn: 0.96, isBack: false, headTilt: -6, hairWhip: 8,
      lLift: 3, rLift: -6.5,
      lThigh: -14, lShin: 4, rThigh: 14, rShin: -4,
      lUpper: -24, lFore: 34, rUpper: 34, rFore: -54,
      ballX: -50, ballY: 90, ballSpin: 720, ballSx: 1, ballSy: 1
    },

    // 阶段四：收球 · 指尖转球谢幕定格
    {
      t: 0.84,
      hipX: 210, hipY: 150, lean: -4, turn: 1, isBack: false, headTilt: -5, hairWhip: -6,
      lLift: 0, rLift: 0,
      lThigh: -14, lShin: 4, rThigh: 20, rShin: 16,
      lUpper: -45, lFore: 55, rUpper: 125, rFore: 168,
      ballX: 246.5, ballY: 46.5, ballSpin: 1400, ballSx: 1, ballSy: 1,
      fx: 'spark', fxX: 246.5, fxY: 46.5
    },
    {
      t: 1.00,
      hipX: 210, hipY: 150, lean: -4, turn: 1, isBack: false, headTilt: -4, hairWhip: 2,
      lLift: 0, rLift: 0,
      lThigh: -14, lShin: 4, rThigh: 20, rShin: 16,
      lUpper: -45, lFore: 55, rUpper: 125, rFore: 168,
      ballX: 246.5, ballY: 46.5, ballSpin: 2120, ballSx: 1, ballSy: 1
    }
  ];

  function lerp(a, b, t) { return a + (b - a) * t; }
  function easeInOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function rad(deg) { return deg * Math.PI / 180; }
  function limbEnd(x, y, deg, len) {
    var r = rad(deg);
    return [x + Math.sin(r) * len, y + Math.cos(r) * len];
  }

  function createStage() {
    var el = document.createElement('div');
    el.className = 'egg-stage';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML =
      '<div class="egg-stage__spot"></div>' +
      '<svg class="egg-stage__svg" viewBox="0 0 420 260" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<radialGradient id="eggFloorGlow" cx="50%" cy="50%" r="50%">' +
            '<stop offset="0%" stop-color="rgba(255,122,61,0.22)"/>' +
            '<stop offset="60%" stop-color="rgba(255,255,255,0.06)"/>' +
            '<stop offset="100%" stop-color="rgba(255,122,61,0)"/>' +
          '</radialGradient>' +
          '<clipPath id="eggBallClip"><circle cx="0" cy="0" r="16"/></clipPath>' +
        '</defs>' +
        '<line x1="40" y1="224" x2="380" y2="224" stroke="rgba(255,255,255,0.12)" stroke-width="1.2" stroke-linecap="round"/>' +
        '<ellipse data-el="floorShadow" cx="210" cy="224" rx="74" ry="8" fill="url(#eggFloorGlow)"/>' +
        '<ellipse data-el="ballShadow" cx="235" cy="224" rx="14" ry="3.5" fill="rgba(0,0,0,0.5)"/>' +
        '<g data-el="fxLayer" fill="none" stroke-linecap="round"></g>' +
        '<g fill="none" stroke="#b6b8bf" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path data-el="legR"/><path data-el="armR"/>' +
        '</g>' +
        '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
          '<path data-el="torsoLine" stroke="#e8e8ea" stroke-width="4.8"/>' +
          '<path data-el="strapL" stroke="#b5b8c2" stroke-width="2.2"/>' +
          '<path data-el="strapR" stroke="#b5b8c2" stroke-width="2.2"/>' +
          '<path data-el="waistBand" stroke="#8b8d94" stroke-width="2.2"/>' +
        '</g>' +
        '<g data-el="headGroup">' +
          '<circle cx="0" cy="0" r="14.5" fill="#131418" stroke="#e8e8ea" stroke-width="4.2"/>' +
          '<g data-el="hairGroup" fill="none" stroke="#e8e8ea" stroke-width="3.2" stroke-linecap="round">' +
            '<path data-el="hairL" d="M 0 -13 C -7 -13, -13 -7, -14 2"/>' +
            '<path data-el="hairR" d="M 0 -13 C 7 -13, 13 -7, 14 2"/>' +
          '</g>' +
        '</g>' +
        '<g fill="none" stroke="#e8e8ea" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round">' +
          '<path data-el="legL"/><path data-el="armL"/>' +
        '</g>' +
        '<g data-el="stageBall" transform="translate(240, 120)">' +
          '<g data-el="ballSpin">' +
            '<circle cx="0" cy="0" r="16" fill="#1c1512" stroke="#FF7A3D" stroke-width="2.5"/>' +
            '<g clip-path="url(#eggBallClip)" fill="none" stroke="#FF7A3D" stroke-width="1.6">' +
              '<line x1="0" y1="-16" x2="0" y2="16"/>' +
              '<line x1="-16" y1="0" x2="16" y2="0"/>' +
              '<path d="M -9 -14 C -2 -6, -2 6, -9 14"/>' +
              '<path d="M 9 -14 C 2 -6, 2 6, 9 14"/>' +
            '</g>' +
          '</g>' +
        '</g>' +
      '</svg>';
    return el;
  }

  function startShow() {
    if (isPlaying) return;
    isPlaying = true;

    var stage = createStage();
    slot.appendChild(stage);

    var q = function (name) { return stage.querySelector('[data-el="' + name + '"]'); };
    var elTorso    = q('torsoLine');
    var elStrapL   = q('strapL');
    var elStrapR   = q('strapR');
    var elWaist    = q('waistBand');
    var elHead     = q('headGroup');
    var elHairGrp  = q('hairGroup');
    var elHairL    = q('hairL');
    var elHairR    = q('hairR');
    var elLegL     = q('legL');
    var elLegR     = q('legR');
    var elArmL     = q('armL');
    var elArmR     = q('armR');
    var elBall     = q('stageBall');
    var elBallSpin = q('ballSpin');
    var elBallShad = q('ballShadow');
    var elFloorSh  = q('floorShadow');
    var elFxLayer  = q('fxLayer');

    function spawnFx(type, x, y) {
      var ns = 'http://www.w3.org/2000/svg';
      if (type === 'bounce') {
        var ring = document.createElementNS(ns, 'ellipse');
        ring.setAttribute('cx', x);
        ring.setAttribute('cy', 224);
        ring.setAttribute('rx', 10);
        ring.setAttribute('ry', 3);
        ring.setAttribute('stroke', '#FF7A3D');
        ring.setAttribute('stroke-width', '2');
        elFxLayer.appendChild(ring);
        ring.animate([
          { opacity: 0.9, transform: 'scale(0.8)', transformOrigin: x + 'px 224px' },
          { opacity: 0,   transform: 'scale(2.6)', transformOrigin: x + 'px 224px' }
        ], { duration: 420, easing: 'ease-out', fill: 'forwards' }).onfinish = function () { ring.remove(); };
      } else if (type === 'shrug' || type === 'shrugFront') {
        var g = document.createElementNS(ns, 'g');
        g.setAttribute('stroke', '#FF7A3D');
        g.setAttribute('stroke-width', '2');
        var cx = 210, cy = type === 'shrug' ? 105 : 100;
        [-26, 26].forEach(function (dx) {
          var arc = document.createElementNS(ns, 'path');
          var dir = dx < 0 ? -1 : 1;
          arc.setAttribute('d', 'M ' + (cx + dx) + ' ' + (cy - 10) + ' Q ' + (cx + dx + dir * 7) + ' ' + cy + ' ' + (cx + dx) + ' ' + (cy + 10));
          g.appendChild(arc);
        });
        elFxLayer.appendChild(g);
        g.animate([
          { opacity: 0.9, transform: 'scale(0.9)', transformOrigin: cx + 'px ' + cy + 'px' },
          { opacity: 0,   transform: 'scale(1.25)', transformOrigin: cx + 'px ' + cy + 'px' }
        ], { duration: 550, easing: 'ease-out', fill: 'forwards' }).onfinish = function () { g.remove(); };
      } else if (type === 'spark') {
        var sg = document.createElementNS(ns, 'g');
        sg.setAttribute('stroke', '#FF7A3D');
        sg.setAttribute('stroke-width', '2');
        for (var i = 0; i < 6; i++) {
          var a = (i * 60) * Math.PI / 180;
          var l = document.createElementNS(ns, 'line');
          l.setAttribute('x1', x + Math.cos(a) * 20);
          l.setAttribute('y1', y + Math.sin(a) * 20);
          l.setAttribute('x2', x + Math.cos(a) * 30);
          l.setAttribute('y2', y + Math.sin(a) * 30);
          sg.appendChild(l);
        }
        elFxLayer.appendChild(sg);
        sg.animate([
          { opacity: 0.95, transform: 'scale(0.6)', transformOrigin: x + 'px ' + y + 'px' },
          { opacity: 0,    transform: 'scale(1.4)', transformOrigin: x + 'px ' + y + 'px' }
        ], { duration: 550, easing: 'ease-out', fill: 'forwards' }).onfinish = function () { sg.remove(); };
      }
    }

    function renderPose(p) {
      var hipX = p.hipX, hipY = p.hipY;
      var leanRad = rad(p.lean);
      var shX = hipX + Math.sin(leanRad) * TORSO_LEN;
      var shY = hipY - Math.cos(leanRad) * TORSO_LEN;

      var turnAbs = Math.max(0.3, Math.abs(p.turn));
      var shSpan = 13.5 * turnAbs;
      var hpSpan = 8 * turnAbs;

      var lShX = shX - shSpan, lShY = shY + Math.sin(leanRad) * 2 + (p.lLift || 0);
      var rShX = shX + shSpan, rShY = shY - Math.sin(leanRad) * 2 + (p.rLift || 0);
      var lHpX = hipX - hpSpan, lHpY = hipY;
      var rHpX = hipX + hpSpan, rHpY = hipY;

      elTorso.setAttribute('d', 'M ' + hipX.toFixed(1) + ' ' + hipY.toFixed(1) + ' L ' + shX.toFixed(1) + ' ' + shY.toFixed(1));
      var lTopX = lShX * 0.68 + shX * 0.32, lTopY = lShY * 0.68 + shY * 0.32;
      var rTopX = rShX * 0.68 + shX * 0.32, rTopY = rShY * 0.68 + shY * 0.32;
      var lBotX = p.isBack ? hipX : (lHpX * 0.72 + hipX * 0.28);
      var rBotX = p.isBack ? hipX : (rHpX * 0.72 + hipX * 0.28);
      elStrapL.setAttribute('d', 'M ' + lTopX.toFixed(1) + ' ' + lTopY.toFixed(1) + ' L ' + lBotX.toFixed(1) + ' ' + (hipY - 2).toFixed(1));
      elStrapR.setAttribute('d', 'M ' + rTopX.toFixed(1) + ' ' + rTopY.toFixed(1) + ' L ' + rBotX.toFixed(1) + ' ' + (hipY - 2).toFixed(1));
      elWaist.setAttribute('d', 'M ' + (hipX - hpSpan - 3).toFixed(1) + ' ' + (hipY - 2).toFixed(1) + ' L ' + (hipX + hpSpan + 3).toFixed(1) + ' ' + (hipY - 2).toFixed(1));

      var headX = shX + Math.sin(leanRad) * 19;
      var headY = shY - Math.cos(leanRad) * 19;
      elHead.setAttribute('transform', 'translate(' + headX.toFixed(1) + ',' + headY.toFixed(1) + ') rotate(' + p.headTilt.toFixed(1) + ')');
      if (p.isBack) {
        elHairGrp.setAttribute('opacity', '0');
      } else {
        elHairGrp.setAttribute('opacity', '1');
        var whip = p.hairWhip;
        elHairL.setAttribute('d', 'M 0 -13 C ' + (-7 + whip * 0.2).toFixed(1) + ' -13, ' + (-13 + whip * 0.35).toFixed(1) + ' -6, ' + (-14 + whip * 0.45).toFixed(1) + ' 3');
        elHairR.setAttribute('d', 'M 0 -13 C ' + (7 + whip * 0.2).toFixed(1) + ' -13, ' + (13 + whip * 0.35).toFixed(1) + ' -6, ' + (14 + whip * 0.45).toFixed(1) + ' 3');
      }

      var lKnee = limbEnd(lHpX, lHpY, p.lThigh, THIGH);
      var lFoot = limbEnd(lKnee[0], lKnee[1], p.lShin, SHIN);
      elLegL.setAttribute('d', 'M ' + lHpX.toFixed(1) + ' ' + lHpY.toFixed(1) + ' L ' + lKnee[0].toFixed(1) + ' ' + lKnee[1].toFixed(1) + ' L ' + lFoot[0].toFixed(1) + ' ' + lFoot[1].toFixed(1));

      var rKnee = limbEnd(rHpX, rHpY, p.rThigh, THIGH);
      var rFoot = limbEnd(rKnee[0], rKnee[1], p.rShin, SHIN);
      elLegR.setAttribute('d', 'M ' + rHpX.toFixed(1) + ' ' + rHpY.toFixed(1) + ' L ' + rKnee[0].toFixed(1) + ' ' + rKnee[1].toFixed(1) + ' L ' + rFoot[0].toFixed(1) + ' ' + rFoot[1].toFixed(1));

      var lElb  = limbEnd(lShX, lShY, p.lUpper, UPPER);
      var lHand = limbEnd(lElb[0], lElb[1], p.lFore, FORE);
      elArmL.setAttribute('d', 'M ' + shX.toFixed(1) + ' ' + shY.toFixed(1) + ' L ' + lShX.toFixed(1) + ' ' + lShY.toFixed(1) + ' L ' + lElb[0].toFixed(1) + ' ' + lElb[1].toFixed(1) + ' L ' + lHand[0].toFixed(1) + ' ' + lHand[1].toFixed(1));

      var rElb  = limbEnd(rShX, rShY, p.rUpper, UPPER);
      var rHand = limbEnd(rElb[0], rElb[1], p.rFore, FORE);
      elArmR.setAttribute('d', 'M ' + shX.toFixed(1) + ' ' + shY.toFixed(1) + ' L ' + rShX.toFixed(1) + ' ' + rShY.toFixed(1) + ' L ' + rElb[0].toFixed(1) + ' ' + rElb[1].toFixed(1) + ' L ' + rHand[0].toFixed(1) + ' ' + rHand[1].toFixed(1));

      var bx = p.ballX, by = p.ballY;
      var inStage = bx > -20 && bx < 440;
      elBall.setAttribute('opacity', inStage ? '1' : '0');
      elBall.setAttribute('transform', 'translate(' + bx.toFixed(1) + ',' + by.toFixed(1) + ') scale(' + p.ballSx.toFixed(3) + ',' + p.ballSy.toFixed(3) + ')');
      elBallSpin.setAttribute('transform', 'rotate(' + p.ballSpin.toFixed(1) + ')');

      var distFloor = Math.max(0, 224 - by);
      var shadScale = Math.max(0.35, 1 - distFloor / 230);
      elBallShad.setAttribute('cx', bx.toFixed(1));
      elBallShad.setAttribute('rx', (15 * shadScale).toFixed(1));
      elBallShad.setAttribute('opacity', inStage ? (0.65 * shadScale).toFixed(2) : '0');
      elFloorSh.setAttribute('cx', hipX.toFixed(1));
    }

    renderPose(KEYFRAMES[0]);
    grid.classList.add('is-hidden');
    requestAnimationFrame(function () {
      stage.classList.add('is-active');
    });

    var triggeredFx = new Set();
    var startTime = null;

    function finishShow() {
      stage.classList.remove('is-active');
      grid.classList.remove('is-hidden');
      setTimeout(function () {
        stage.remove();
        isPlaying = false;
      }, 360);
    }

    function tick(now) {
      if (!startTime) startTime = now;
      var progress = Math.min(1, (now - startTime) / DURATION);

      var k0 = KEYFRAMES[0], k1 = KEYFRAMES[KEYFRAMES.length - 1];
      for (var i = 0; i < KEYFRAMES.length - 1; i++) {
        if (progress >= KEYFRAMES[i].t && progress <= KEYFRAMES[i + 1].t) {
          k0 = KEYFRAMES[i];
          k1 = KEYFRAMES[i + 1];
          if (k0.fx && !triggeredFx.has(i)) {
            triggeredFx.add(i);
            spawnFx(k0.fx, k0.fxX, k0.fxY);
          }
          break;
        }
      }
      if (progress >= 0.835 && !triggeredFx.has('final')) {
        triggeredFx.add('final');
        var sparkKf = KEYFRAMES[KEYFRAMES.length - 2];
        if (sparkKf.fx) spawnFx(sparkKf.fx, sparkKf.fxX, sparkKf.fxY);
      }

      var span = (k1.t - k0.t) || 1;
      var localT = easeInOut(Math.max(0, Math.min(1, (progress - k0.t) / span)));

      renderPose({
        t: progress,
        hipX: lerp(k0.hipX, k1.hipX, localT),
        hipY: lerp(k0.hipY, k1.hipY, localT),
        lean: lerp(k0.lean, k1.lean, localT),
        turn: lerp(k0.turn, k1.turn, localT),
        isBack: localT < 0.5 ? k0.isBack : k1.isBack,
        headTilt: lerp(k0.headTilt, k1.headTilt, localT),
        hairWhip: lerp(k0.hairWhip, k1.hairWhip, localT),
        lLift: lerp(k0.lLift || 0, k1.lLift || 0, localT),
        rLift: lerp(k0.rLift || 0, k1.rLift || 0, localT),
        lThigh: lerp(k0.lThigh, k1.lThigh, localT),
        lShin:  lerp(k0.lShin,  k1.lShin,  localT),
        rThigh: lerp(k0.rThigh, k1.rThigh, localT),
        rShin:  lerp(k0.rShin,  k1.rShin,  localT),
        lUpper: lerp(k0.lUpper, k1.lUpper, localT),
        lFore:  lerp(k0.lFore,  k1.lFore,  localT),
        rUpper: lerp(k0.rUpper, k1.rUpper, localT),
        rFore:  lerp(k0.rFore,  k1.rFore,  localT),
        ballX:  lerp(k0.ballX,  k1.ballX,  localT),
        ballY:  lerp(k0.ballY,  k1.ballY,  localT),
        ballSpin: lerp(k0.ballSpin, k1.ballSpin, localT),
        ballSx: lerp(k0.ballSx, k1.ballSx, localT),
        ballSy: lerp(k0.ballSy, k1.ballSy, localT)
      });

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(finishShow, HOLD_AFTER_END);
      }
    }

    requestAnimationFrame(tick);
  }

  // 双击篮球抛物线飞入触发
  function passBallAndPlay() {
    if (isPlaying || isLaunching) return;
    isLaunching = true;
    var bRect = ballIcon.getBoundingClientRect();
    var dRect = danceIcon.getBoundingClientRect();
    var sx = bRect.left + bRect.width / 2;
    var sy = bRect.top + bRect.height / 2;
    var ex = dRect.left + dRect.width / 2;
    var ey = dRect.top + dRect.height / 2;

    var fly = document.createElement('div');
    fly.className = 'egg-fly-ball';
    fly.innerHTML = ballIcon.innerHTML;
    document.body.appendChild(fly);

    var t0 = null;
    var flyDur = 400;
    function step(now) {
      if (!t0) t0 = now;
      var p = Math.min(1, (now - t0) / flyDur);
      var x = lerp(sx, ex, p);
      var y = lerp(sy, ey, p) - Math.sin(p * Math.PI) * 84;
      fly.style.left = x + 'px';
      fly.style.top = y + 'px';
      fly.style.transform = 'rotate(' + (p * 540) + 'deg) scale(' + (1 + Math.sin(p * Math.PI) * 0.4) + ')';

      if (p < 1) {
        requestAnimationFrame(step);
      } else {
        fly.remove();
        danceCard.classList.add('is-drop-hover');
        setTimeout(function () {
          danceCard.classList.remove('is-drop-hover');
          isLaunching = false;
          startShow();
        }, 160);
      }
    }
    requestAnimationFrame(step);
  }

  ballIcon.addEventListener('dblclick', function (e) {
    e.preventDefault();
    passBallAndPlay();
  });

  // 拖拽篮球到「跳」卡片触发
  var dragState = null;

  ballIcon.addEventListener('pointerdown', function (e) {
    if (isPlaying || isLaunching) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragState = {
      id: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      active: false,
      ghost: null
    };
    ballIcon.setPointerCapture(e.pointerId);
  });

  ballIcon.addEventListener('pointermove', function (e) {
    if (!dragState || e.pointerId !== dragState.id) return;
    var dx = e.clientX - dragState.startX;
    var dy = e.clientY - dragState.startY;

    if (!dragState.active && Math.hypot(dx, dy) > 8) {
      dragState.active = true;
      document.body.classList.add('egg-dragging');
      ballIcon.classList.add('is-dragging');
      danceCard.classList.add('is-drop-ready');

      var ghost = document.createElement('div');
      ghost.className = 'egg-drag-ball';
      ghost.innerHTML = ballIcon.innerHTML;
      document.body.appendChild(ghost);
      dragState.ghost = ghost;
    }

    if (dragState.active && dragState.ghost) {
      dragState.ghost.style.left = e.clientX + 'px';
      dragState.ghost.style.top = e.clientY + 'px';

      var rect = danceCard.getBoundingClientRect();
      var over = e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 &&
                 e.clientY >= rect.top - 10  && e.clientY <= rect.bottom + 10;
      danceCard.classList.toggle('is-drop-hover', over);
      dragState.ghost.classList.toggle('is-over-target', over);
    }
  });

  function endDrag(e) {
    if (!dragState || e.pointerId !== dragState.id) return;
    var st = dragState;
    dragState = null;

    document.body.classList.remove('egg-dragging');
    danceCard.classList.remove('is-drop-ready', 'is-drop-hover');
    ballIcon.classList.remove('is-dragging');

    if (!st.active || !st.ghost) return;

    var rect = danceCard.getBoundingClientRect();
    var droppedOnDance = e.clientX >= rect.left - 10 && e.clientX <= rect.right + 10 &&
                         e.clientY >= rect.top - 10  && e.clientY <= rect.bottom + 10;

    if (droppedOnDance) {
      st.ghost.remove();
      startShow();
    } else {
      var bRect = ballIcon.getBoundingClientRect();
      var tx = bRect.left + bRect.width / 2 - e.clientX;
      var ty = bRect.top + bRect.height / 2 - e.clientY;
      st.ghost.classList.add('is-returning');
      st.ghost.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(0.7)';
      st.ghost.style.opacity = '0';
      setTimeout(function () { st.ghost.remove(); }, 340);
    }
  }

  ballIcon.addEventListener('pointerup', endDrag);
  ballIcon.addEventListener('pointercancel', endDrag);
})();
